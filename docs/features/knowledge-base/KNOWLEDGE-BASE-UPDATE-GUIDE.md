# 📚 Knowledge Base Update Guide

**Last Updated**: December 22, 2024  
**Feature**: Document Management Workflow  
**Status**: Active

---

## Overview

The Knowledge Base Update Guide provides a comprehensive workflow for managing documentation within the SHELTR platform. This system enables administrators to add, update, and maintain knowledge documents that power the AI chatbot's responses.

---

## Key Features

### 1. Document Management
- **Upload Documents**: Add new markdown files to the knowledge base
- **Update Existing**: Modify content of existing documents
- **Version Control**: Track changes and maintain document history
- **Bulk Operations**: Process multiple documents simultaneously

### 2. Content Types Supported
- **Public Documentation**: Platform guides, FAQs, feature docs
- **Secure Documents**: Internal docs with role-based access
- **API Documentation**: Technical references and guides
- **Ecosystem Docs**: PODs, Drones, Basecamp, MOBI information

### 3. Quality Control
- **Quality Scores**: Automated assessment (0-100 scale)
- **Content Validation**: Check for completeness and formatting
- **Duplicate Detection**: Prevent redundant content
- **Embedding Status**: Track AI processing state

---

## Document Workflow

### Adding New Documents

**Option 1: GitHub Sync**
1. Add markdown file to `docs/` folder in repository
2. Commit and push to GitHub
3. Navigate to Knowledge Dashboard
4. Click "Scan for Changes" in GitHub Sync panel
5. Review detected files
6. Click "Sync Files" to import
7. Wait for embedding generation (~30 seconds)

**Option 2: Secure Document Upload**
1. Place files in `.local-secure-docs/` directory
2. Organize by category (blog-posts, dataroom, fintec, founders, leadership, operations)
3. Navigate to Knowledge Dashboard
4. Open "Secure Document Sync" panel
5. Click "Sync Secure Documents"
6. System processes files and generates embeddings

### Updating Documents

**GitHub Documents**:
1. Edit markdown file in repository
2. Commit and push changes
3. Run GitHub sync
4. System detects modifications
5. Updates content and regenerates embeddings

**Secure Documents**:
1. Modify file in `.local-secure-docs/` directory
2. Run Secure Document Sync
3. System updates Firestore and embeddings

### Deleting Documents

**From GitHub**:
1. Delete file from repository
2. Run GitHub sync
3. System shows deleted files
4. Click individual delete buttons or "Delete All"
5. Confirm deletion

**Orphaned Documents**:
1. Open Secure Document Sync panel
2. Click "Clean Up Orphaned Docs"
3. System removes documents with no content/path
4. Confirm cleanup

---

## Best Practices

### Content Guidelines
- **Clear Titles**: Use descriptive, searchable titles
- **Structured Content**: Use headings, lists, and formatting
- **Complete Information**: Avoid empty or stub files
- **Consistent Naming**: Follow naming conventions
- **Proper Categories**: Assign appropriate tags and categories

### Maintenance
- **Regular Audits**: Review quality scores monthly
- **Remove Outdated**: Delete obsolete documentation
- **Update Frequently**: Keep information current
- **Monitor Embeddings**: Ensure all docs have embeddings generated

### Performance
- **Batch Operations**: Sync multiple files at once
- **Off-Peak Updates**: Schedule large syncs during low-traffic periods
- **Cache Management**: System auto-invalidates after updates
- **Monitor Metrics**: Track pending embeddings count

---

## Metrics & Monitoring

### Dashboard Metrics
- **Total Documents**: All documents in knowledge base
- **Active Documents**: Documents with status='active'
- **Pending Embeddings**: Documents awaiting AI processing
- **Total Chunks**: Number of text segments for AI
- **Total Words**: Aggregate word count
- **Categories**: Number of distinct categories

### Quality Indicators
- **Quality Score**: 0-100 rating based on completeness
- **Chunk Count**: Number of AI-processable segments
- **Word Count**: Document length
- **View Count**: Usage tracking
- **Last Updated**: Modification timestamp

---

## Troubleshooting

### Common Issues

**Pending Embeddings Stuck**
- **Cause**: Cache not invalidated or empty files
- **Solution**: Hard refresh page, run cleanup for orphaned docs

**Sync Not Detecting Changes**
- **Cause**: File not in tracked directories
- **Solution**: Verify file location, check .gitignore

**Delete Button Not Working**
- **Cause**: Permission issue or frontend bug
- **Solution**: Use "Clean Up Orphaned Docs" or check console errors

**Quality Score Low**
- **Cause**: Incomplete content, poor formatting
- **Solution**: Add more content, improve structure

---

## Related Documentation

- [Sync System](KNOWLEDGE-BASE-SYNC-SYSTEM.md) - GitHub integration details
- [Strategy](KNOWLEDGE-BASE-STRATEGY.md) - Expansion and optimization
- [Collections Explained](KNOWLEDGE-BASE-COLLECTIONS-EXPLAINED.md) - Data structure
- [Edit/Delete Flow](KNOWLEDGE-BASE-EDIT-DELETE-FLOW.md) - Management operations

---

## Support

For issues or questions:
- Check backend logs: `tail -f logs/backend.log`
- Review frontend console for errors
- Verify Firebase permissions
- Contact platform administrator
