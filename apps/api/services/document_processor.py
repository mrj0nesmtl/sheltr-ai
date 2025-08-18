"""
SHELTR-AI Document Processing Service
Processes various document formats for knowledge base ingestion
"""

import os
import re
import logging
from typing import Dict, List, Any, Optional, Union
from pathlib import Path
import hashlib
from datetime import datetime

# Document processing imports
import PyPDF2
import docx
import markdown
# import magic  # Removed due to libmagic dependency issues

# Firebase and OpenAI imports
from firebase_admin import storage, firestore
from services.openai_service import openai_service

logger = logging.getLogger(__name__)

class DocumentProcessor:
    """Process various document formats for knowledge base ingestion"""
    
    def __init__(self):
        self.supported_formats = {
            '.pdf': self._process_pdf,
            '.docx': self._process_docx,
            '.doc': self._process_docx,  # Try docx processor for .doc files
            '.txt': self._process_text,
            '.md': self._process_markdown,
            '.html': self._process_html
        }
        
        # Firebase clients (lazy initialization)
        self._storage_client = None
        self._db = None
        
        # Document categories for organization
        self.categories = {
            'sheltr': ['overview', 'mission', 'homelessness', 'murray'],
            'platform': ['architecture', 'api', 'development', 'security', 'system'],
            'tokenomics': ['blockchain', 'token', 'whitepaper', 'crypto'],
            'user_guides': ['guide', 'admin', 'participant', 'donor']
        }
    
    @property
    def storage_client(self):
        """Lazy initialization of Firebase storage client"""
        if self._storage_client is None:
            bucket_name = os.getenv("FIREBASE_STORAGE_BUCKET", "sheltr-ai.firebasestorage.app")
            self._storage_client = storage.bucket(bucket_name)
        return self._storage_client
    
    @property
    def db(self):
        """Lazy initialization of Firestore client"""
        if self._db is None:
            self._db = firestore.client()
        return self._db
    
    async def process_document(
        self, 
        file_path: str, 
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Process document and extract text content with metadata"""
        
        try:
            # Validate file exists
            if not os.path.exists(file_path):
                raise FileNotFoundError(f"Document not found: {file_path}")
            
            # Get file info
            file_info = self._analyze_file(file_path)
            
            # Determine processing method
            file_ext = file_info['extension'].lower()
            processor = self.supported_formats.get(file_ext)
            if not processor:
                raise ValueError(f"Unsupported file type: {file_ext}")
            
            logger.info(f"Processing {file_info['name']} ({file_ext})")
            
            # Extract text content
            content_data = await processor(file_path)
            
            # Auto-categorize document
            category = self._auto_categorize(file_path, content_data['text'])
            
            # Generate summary using OpenAI
            summary = await self._generate_summary(content_data['text'])
            
            # Detect language (simple detection)
            language = self._detect_language(content_data['text'])
            
            # Calculate content hash for deduplication
            content_hash = self._calculate_hash(content_data['text'])
            
            result = {
                'file_info': file_info,
                'content': content_data['text'],
                'summary': summary,
                'category': category,
                'language': language,
                'content_hash': content_hash,
                'word_count': len(content_data['text'].split()),
                'char_count': len(content_data['text']),
                'headings': content_data.get('headings', []),
                'metadata': {
                    **file_info,
                    **(metadata or {}),
                    'processed_at': datetime.now().isoformat(),
                    'processor_version': '1.0.0'
                }
            }
            
            logger.info(f"Successfully processed {file_info['name']} - {result['word_count']} words")
            return result
            
        except Exception as e:
            logger.error(f"Document processing failed for {file_path}: {str(e)}")
            raise
    
    def _analyze_file(self, file_path: str) -> Dict[str, Any]:
        """Analyze file and extract basic information"""
        path = Path(file_path)
        stat = path.stat()
        
        return {
            'name': path.name,
            'stem': path.stem,
            'extension': path.suffix,
            'size': stat.st_size,
            'path': str(path.absolute()),
            'relative_path': str(path),
            'modified_at': datetime.fromtimestamp(stat.st_mtime).isoformat(),
            'created_at': datetime.fromtimestamp(stat.st_ctime).isoformat()
        }
    
    async def _process_pdf(self, file_path: str) -> Dict[str, Any]:
        """Extract text from PDF file"""
        try:
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                text_content = ""
                page_count = len(pdf_reader.pages)
                headings = []
                
                for page_num, page in enumerate(pdf_reader.pages):
                    page_text = page.extract_text()
                    
                    # Simple heading detection (lines that are all caps or short)
                    lines = page_text.split('\n')
                    for i, line in enumerate(lines):
                        line = line.strip()
                        if line and (line.isupper() or len(line) < 60) and not line.isdigit():
                            if any(word in line.lower() for word in ['chapter', 'section', 'introduction', 'conclusion']):
                                headings.append({
                                    'text': line,
                                    'page': page_num + 1,
                                    'level': 1 if line.isupper() else 2
                                })
                    
                    text_content += f"\n--- Page {page_num + 1} ---\n{page_text}"
                
                return {
                    'text': text_content.strip(),
                    'page_count': page_count,
                    'headings': headings,
                    'metadata': {'source': 'pdf_extraction'}
                }
        except Exception as e:
            logger.error(f"PDF processing failed: {str(e)}")
            raise ValueError(f"Failed to process PDF: {str(e)}")
    
    async def _process_docx(self, file_path: str) -> Dict[str, Any]:
        """Extract text from Word document"""
        try:
            doc = docx.Document(file_path)
            text_content = ""
            headings = []
            
            for paragraph in doc.paragraphs:
                # Detect headings by style
                if paragraph.style.name.startswith('Heading'):
                    level = 1
                    if paragraph.style.name[-1].isdigit():
                        level = int(paragraph.style.name[-1])
                    
                    headings.append({
                        'text': paragraph.text,
                        'level': level,
                        'position': len(text_content)
                    })
                
                text_content += paragraph.text + "\n"
            
            return {
                'text': text_content.strip(),
                'headings': headings,
                'metadata': {'source': 'docx_extraction'}
            }
        except Exception as e:
            logger.error(f"DOCX processing failed: {str(e)}")
            raise ValueError(f"Failed to process DOCX: {str(e)}")
    
    async def _process_markdown(self, file_path: str) -> Dict[str, Any]:
        """Extract text from Markdown file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                content = file.read()
            
            # Extract headings using regex
            headings = []
            heading_pattern = r'^(#{1,6})\s+(.+)$'
            
            for match in re.finditer(heading_pattern, content, re.MULTILINE):
                level = len(match.group(1))
                text = match.group(2).strip()
                headings.append({
                    'text': text,
                    'level': level,
                    'position': match.start()
                })
            
            # Convert markdown to plain text (simple approach)
            # Remove markdown syntax
            text_content = content
            text_content = re.sub(r'^#{1,6}\s+', '', text_content, flags=re.MULTILINE)  # Headers
            text_content = re.sub(r'\*\*(.*?)\*\*', r'\1', text_content)  # Bold
            text_content = re.sub(r'\*(.*?)\*', r'\1', text_content)  # Italic
            text_content = re.sub(r'`(.*?)`', r'\1', text_content)  # Inline code
            text_content = re.sub(r'```[\s\S]*?```', '', text_content)  # Code blocks
            text_content = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', text_content)  # Links
            text_content = re.sub(r'\n+', '\n', text_content)  # Multiple newlines
            
            return {
                'text': text_content.strip(),
                'headings': headings,
                'metadata': {'source': 'markdown_extraction', 'original_format': 'markdown'}
            }
        except Exception as e:
            logger.error(f"Markdown processing failed: {str(e)}")
            raise ValueError(f"Failed to process Markdown: {str(e)}")
    
    async def _process_text(self, file_path: str) -> Dict[str, Any]:
        """Extract text from plain text file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                content = file.read()
            
            return {
                'text': content.strip(),
                'headings': [],
                'metadata': {'source': 'text_extraction'}
            }
        except Exception as e:
            logger.error(f"Text processing failed: {str(e)}")
            raise ValueError(f"Failed to process text file: {str(e)}")
    
    async def _process_html(self, file_path: str) -> Dict[str, Any]:
        """Extract text from HTML file (basic)"""
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                content = file.read()
            
            # Very basic HTML tag removal
            text_content = re.sub(r'<[^>]+>', '', content)
            text_content = re.sub(r'\s+', ' ', text_content)
            
            return {
                'text': text_content.strip(),
                'headings': [],
                'metadata': {'source': 'html_extraction'}
            }
        except Exception as e:
            logger.error(f"HTML processing failed: {str(e)}")
            raise ValueError(f"Failed to process HTML: {str(e)}")
    
    def _auto_categorize(self, file_path: str, content: str) -> str:
        """Auto-categorize document based on path and content"""
        file_path_lower = file_path.lower()
        content_lower = content.lower()
        
        # Check path first
        for category, keywords in self.categories.items():
            if any(keyword in file_path_lower for keyword in keywords):
                return category
        
        # Check content keywords
        category_scores = {}
        for category, keywords in self.categories.items():
            score = sum(content_lower.count(keyword) for keyword in keywords)
            if score > 0:
                category_scores[category] = score
        
        if category_scores:
            return max(category_scores, key=category_scores.get)
        
        return 'general'
    
    async def _generate_summary(self, text: str, max_length: int = 200) -> str:
        """Generate document summary using OpenAI"""
        if len(text) < 100:
            return text[:max_length]
        
        try:
            if openai_service.is_available():
                summary_prompt = f"""
                Please provide a concise summary of the following document in 2-3 sentences.
                Focus on the main purpose, key information, and relevance to SHELTR's mission.
                
                Document text (first 2000 characters):
                {text[:2000]}...
                
                Summary:
                """
                
                summary = await openai_service.generate_response(
                    message=summary_prompt,
                    context={'task': 'document_summarization'},
                    system_prompt="You are a document summarization assistant for SHELTR. Provide clear, concise summaries focusing on homeless services and platform features."
                )
                
                return summary[:max_length]
            else:
                # Fallback: use first paragraph or sentences
                sentences = text.split('.')[:3]
                return '.'.join(sentences)[:max_length] + '...'
                
        except Exception as e:
            logger.error(f"Summary generation failed: {str(e)}")
            # Fallback to first paragraph
            first_paragraph = text.split('\n\n')[0] if '\n\n' in text else text.split('\n')[0]
            return first_paragraph[:max_length] + '...'
    
    def _detect_language(self, text: str) -> str:
        """Simple language detection"""
        # Very basic - check for common English words
        english_words = ['the', 'and', 'or', 'to', 'of', 'in', 'for', 'with', 'on', 'at']
        words = text.lower().split()
        english_count = sum(1 for word in words[:100] if word in english_words)
        
        return 'en' if english_count > 5 else 'unknown'
    
    def _calculate_hash(self, content: str) -> str:
        """Calculate content hash for deduplication"""
        return hashlib.sha256(content.encode('utf-8')).hexdigest()
    
    async def batch_process_documents(self, file_paths: List[str]) -> List[Dict[str, Any]]:
        """Process multiple documents in batch"""
        results = []
        
        for file_path in file_paths:
            try:
                result = await self.process_document(file_path)
                results.append({
                    'success': True,
                    'file_path': file_path,
                    'result': result
                })
            except Exception as e:
                logger.error(f"Failed to process {file_path}: {str(e)}")
                results.append({
                    'success': False,
                    'file_path': file_path,
                    'error': str(e)
                })
        
        return results

# Create singleton instance
document_processor = DocumentProcessor()
