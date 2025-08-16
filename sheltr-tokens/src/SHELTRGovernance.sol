// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title SHELTR Governance
 * @dev Governance system for SHELTR token holders
 * 
 * Features:
 * - Proposal creation and voting
 * - Token-weighted voting
 * - Quorum requirements
 * - Execution of approved proposals
 */
contract SHELTRGovernance is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;
    
    // Token contract
    IERC20 public immutable sheltrToken;
    
    // Governance parameters
    uint256 public constant MIN_PROPOSAL_THRESHOLD = 100_000 * 10**18; // 100k SHELTR to create proposal
    uint256 public constant VOTING_PERIOD = 7 days; // 7 days to vote
    uint256 public constant EXECUTION_DELAY = 2 days; // 2 days delay before execution
    uint256 public constant QUORUM_THRESHOLD = 5_000_000 * 10**18; // 5M SHELTR for quorum (5% of supply)
    
    // Veto power parameters
    address public founder; // Joel
    address public foundingMember; // Doug (CFO)
    uint256 public constant VETO_WINDOW = 3 days; // 3 days to veto after proposal passes
    
    // Proposal states
    enum ProposalState { PENDING, ACTIVE, PASSED, VETOED, EXECUTED, EXPIRED, CANCELLED }
    
    // Proposal structure
    struct Proposal {
        uint256 id;
        address proposer;
        string title;
        string description;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 startTime;
        uint256 endTime;
        uint256 executionTime;
        bool executed;
        bool cancelled;
        ProposalState state;
    }
    
    // Vote structure
    struct Vote {
        bool hasVoted;
        bool support;
        uint256 votes;
    }
    
    // Proposals
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => Vote)) public votes;
    uint256 public proposalCount;
    
    // Events
    event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string title);
    event Voted(uint256 indexed proposalId, address indexed voter, bool support, uint256 votes);
    event ProposalPassed(uint256 indexed proposalId);
    event ProposalVetoed(uint256 indexed proposalId, address indexed vetoer);
    event ProposalExecuted(uint256 indexed proposalId);
    event ProposalCancelled(uint256 indexed proposalId);
    event GovernanceParametersUpdated(uint256 minThreshold, uint256 votingPeriod, uint256 quorum);
    event FounderUpdated(address indexed newFounder);
    event FoundingMemberUpdated(address indexed newFoundingMember);
    
    constructor(address _sheltrToken, address _founder, address _foundingMember) Ownable(msg.sender) {
        require(_sheltrToken != address(0), "Invalid SHELTR address");
        require(_founder != address(0), "Invalid founder address");
        require(_foundingMember != address(0), "Invalid founding member address");
        
        sheltrToken = IERC20(_sheltrToken);
        founder = _founder;
        foundingMember = _foundingMember;
    }
    
    /**
     * @dev Create a new proposal
     * @param title Proposal title
     * @param description Proposal description
     */
    function createProposal(string memory title, string memory description) external {
        require(sheltrToken.balanceOf(msg.sender) >= MIN_PROPOSAL_THRESHOLD, "Insufficient tokens to propose");
        require(bytes(title).length > 0, "Title cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");
        
        proposalCount++;
        
        proposals[proposalCount] = Proposal({
            id: proposalCount,
            proposer: msg.sender,
            title: title,
            description: description,
            forVotes: 0,
            againstVotes: 0,
            startTime: block.timestamp,
            endTime: block.timestamp + VOTING_PERIOD,
            executionTime: block.timestamp + VOTING_PERIOD + EXECUTION_DELAY,
            executed: false,
            cancelled: false,
            state: ProposalState.ACTIVE
        });
        
        emit ProposalCreated(proposalCount, msg.sender, title);
    }
    
    /**
     * @dev Vote on a proposal
     * @param proposalId ID of the proposal
     * @param support True for yes, false for no
     */
    function vote(uint256 proposalId, bool support) external {
        require(proposalId > 0 && proposalId <= proposalCount, "Invalid proposal ID");
        require(proposals[proposalId].state == ProposalState.ACTIVE, "Proposal not active");
        require(block.timestamp <= proposals[proposalId].endTime, "Voting period ended");
        require(!votes[proposalId][msg.sender].hasVoted, "Already voted");
        
        uint256 votes = sheltrToken.balanceOf(msg.sender);
        require(votes > 0, "No tokens to vote with");
        
        votes[proposalId][msg.sender] = Vote({
            hasVoted: true,
            support: support,
            votes: votes
        });
        
        if (support) {
            proposals[proposalId].forVotes += votes;
        } else {
            proposals[proposalId].againstVotes += votes;
        }
        
        emit Voted(proposalId, msg.sender, support, votes);
    }
    
    /**
     * @dev Finalize voting and check if proposal passed
     * @param proposalId ID of the proposal
     */
    function finalizeProposal(uint256 proposalId) external {
        require(proposalId > 0 && proposalId <= proposalCount, "Invalid proposal ID");
        require(proposals[proposalId].state == ProposalState.ACTIVE, "Proposal not active");
        require(block.timestamp > proposals[proposalId].endTime, "Voting period not ended");
        
        Proposal storage proposal = proposals[proposalId];
        
        // Check quorum
        require(proposal.forVotes + proposal.againstVotes >= QUORUM_THRESHOLD, "Quorum not met");
        
        // Check if proposal passed
        if (proposal.forVotes > proposal.againstVotes) {
            proposal.state = ProposalState.PASSED;
            emit ProposalPassed(proposalId);
        } else {
            proposal.state = ProposalState.EXPIRED;
        }
    }
    
    /**
     * @dev Veto a passed proposal (founder + founding member)
     * @param proposalId ID of the proposal
     */
    function vetoProposal(uint256 proposalId) external {
        require(proposalId > 0 && proposalId <= proposalCount, "Invalid proposal ID");
        require(proposals[proposalId].state == ProposalState.PASSED, "Proposal not passed");
        require(msg.sender == founder || msg.sender == foundingMember, "Not authorized to veto");
        require(block.timestamp <= proposals[proposalId].endTime + VETO_WINDOW, "Veto window expired");
        
        proposals[proposalId].state = ProposalState.VETOED;
        
        emit ProposalVetoed(proposalId, msg.sender);
    }
    
    /**
     * @dev Execute a passed proposal (after veto window)
     * @param proposalId ID of the proposal
     */
    function executeProposal(uint256 proposalId) external {
        require(proposalId > 0 && proposalId <= proposalCount, "Invalid proposal ID");
        require(proposals[proposalId].state == ProposalState.PASSED, "Proposal not passed");
        require(block.timestamp > proposals[proposalId].endTime + VETO_WINDOW, "Veto window not expired");
        require(!proposals[proposalId].executed, "Already executed");
        
        proposals[proposalId].executed = true;
        proposals[proposalId].state = ProposalState.EXECUTED;
        
        emit ProposalExecuted(proposalId);
    }
    
    /**
     * @dev Cancel a proposal (only proposer or owner)
     * @param proposalId ID of the proposal
     */
    function cancelProposal(uint256 proposalId) external {
        require(proposalId > 0 && proposalId <= proposalCount, "Invalid proposal ID");
        require(proposals[proposalId].state == ProposalState.ACTIVE, "Proposal not active");
        require(msg.sender == proposals[proposalId].proposer || msg.sender == owner(), "Not authorized");
        
        proposals[proposalId].cancelled = true;
        proposals[proposalId].state = ProposalState.CANCELLED;
        
        emit ProposalCancelled(proposalId);
    }
    
    /**
     * @dev Get proposal details
     * @param proposalId ID of the proposal
     * @return proposal Proposal details
     */
    function getProposal(uint256 proposalId) external view returns (Proposal memory) {
        require(proposalId > 0 && proposalId <= proposalCount, "Invalid proposal ID");
        return proposals[proposalId];
    }
    
    /**
     * @dev Get vote details for a voter
     * @param proposalId ID of the proposal
     * @param voter Address of the voter
     * @return vote Vote details
     */
    function getVote(uint256 proposalId, address voter) external view returns (Vote memory) {
        return votes[proposalId][voter];
    }
    
    /**
     * @dev Check if proposal can be executed
     * @param proposalId ID of the proposal
     * @return canExecute Whether proposal can be executed
     */
    function canExecuteProposal(uint256 proposalId) external view returns (bool) {
        if (proposalId == 0 || proposalId > proposalCount) return false;
        
        Proposal memory proposal = proposals[proposalId];
        
        return proposal.state == ProposalState.ACTIVE &&
               block.timestamp >= proposal.executionTime &&
               !proposal.executed &&
               (proposal.forVotes + proposal.againstVotes) >= QUORUM_THRESHOLD &&
               proposal.forVotes > proposal.againstVotes;
    }
    
    /**
     * @dev Update founder address
     * @param newFounder New founder address
     */
    function updateFounder(address newFounder) external onlyOwner {
        require(newFounder != address(0), "Invalid founder address");
        founder = newFounder;
        emit FounderUpdated(newFounder);
    }
    
    /**
     * @dev Update founding member address
     * @param newFoundingMember New founding member address
     */
    function updateFoundingMember(address newFoundingMember) external onlyOwner {
        require(newFoundingMember != address(0), "Invalid founding member address");
        foundingMember = newFoundingMember;
        emit FoundingMemberUpdated(newFoundingMember);
    }
    
    /**
     * @dev Pause governance (emergency only)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause governance
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}
