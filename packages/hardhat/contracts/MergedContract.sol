// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title EventChainContract
 * @dev Advanced event management and ticketing with privacy-preserving features
 * @author EventChain Team
 * @notice This contract enables decentralized event creation and ticket issuance with zero-knowledge privacy
 */
contract EventChainContract is ERC721, Ownable, ReentrancyGuard, Pausable {
    uint256 private _nextTokenId;
    uint256 private _nextEventId;
    
    // Platform fee (in basis points, e.g., 250 = 2.5%)
    uint256 public platformFee = 250;
    address public feeRecipient;

    enum EventStatus { Active, Completed, Cancelled, Paused }
    enum EventCategory { Conference, Concert, Sports, Workshop, Meetup, Festival, Other }

    struct Event {
        uint256 eventId;
        address organizer;
        string name;
        string description;
        string imageCID;
        uint256 startTime;
        uint256 endTime;
        string venueName;
        string streetAddress;
        string city;
        string state;
        string postalCode;
        string country;
        bool isOnline;
        uint256 ticketPrice;
        uint256 maxAttendees;
        uint256 ticketsSold;
        EventStatus status;
        EventCategory category;
        bool isPrivate;
        uint256 createdAt;
        uint256 totalRating;
        uint256 ratingCount;
    }

    struct TicketMetadata {
        uint256 eventId;
        uint256 purchaseTime;
        bytes32 userHash;
        bool isUsed;
    }

    // Event storage
    mapping(uint256 => Event) public events;
    mapping(address => uint256[]) public organizerEvents;
    mapping(EventCategory => uint256[]) public eventsByCategory;

    // Ticket management with enhanced privacy
    mapping(uint256 => TicketMetadata) public ticketMetadata; // tokenId => metadata
    mapping(bytes32 => uint256[]) private userTickets; // hash1 => tokenIds
    mapping(bytes32 => bool) private ticketExists; // hash2 => exists
    mapping(uint256 => mapping(bytes32 => bool)) private eventTickets; // eventId => hash1 => has ticket
    mapping(bytes32 => uint256[]) public userEvents; // hash1 => eventIds
    mapping(bytes32 => uint256) public ticketHashes; // hash2 => tokenId

    // Rating system
    mapping(uint256 => mapping(address => bool)) public hasRated; // eventId => user => hasRated

    // Events
    event EventCreated(
        uint256 indexed eventId,
        address indexed organizer,
        string name,
        uint256 startTime,
        uint256 endTime,
        uint256 ticketPrice,
        uint256 maxAttendees,
        EventCategory category
    );
    event EventUpdated(uint256 indexed eventId, string name, uint256 startTime, uint256 endTime);
    event EventCancelled(uint256 indexed eventId, string reason);
    event EventCompleted(uint256 indexed eventId);
    event EventRated(uint256 indexed eventId, address indexed rater, uint256 rating);
    event TicketIssued(uint256 indexed tokenId, uint256 indexed eventId, bytes32 indexed hash1, uint256 price);
    event TicketUsed(uint256 indexed tokenId, uint256 indexed eventId, uint256 timestamp);
    event TicketBurned(uint256 indexed tokenId, uint256 indexed eventId);
    event RefundIssued(address indexed to, uint256 indexed eventId, uint256 amount);
    event PlatformFeeUpdated(uint256 oldFee, uint256 newFee);

    // Custom errors
    error InvalidEventId(uint256 eventId);
    error EventNotActive(uint256 eventId);
    error TicketAlreadyExists(bytes32 hash2);
    error InvalidHash();
    error EventNotFound();
    error UnauthorizedAccess();
    error EventAlreadyEnded();
    error InsufficientPayment();
    error EventSoldOut();
    error RefundFailed();
    error InvalidRating();
    error AlreadyRated();
    error TicketAlreadyUsed();
    error InvalidFee();

    modifier onlyEventOrganizer(uint256 eventId) {
        Event storage eventDetails = events[eventId];
        if (eventDetails.eventId == 0) revert EventNotFound();
        if (msg.sender != eventDetails.organizer) revert UnauthorizedAccess();
        _;
    }

    modifier eventExists(uint256 eventId) {
        if (events[eventId].eventId == 0) revert EventNotFound();
        _;
    }

    constructor() ERC721("EventChain Ticket", "ECT") Ownable(msg.sender) {
        _nextTokenId = 1;
        _nextEventId = 1;
        feeRecipient = msg.sender;
    }

    /**
     * @dev Creates a new event with enhanced metadata
     */
    function createEvent(
        string memory name,
        string memory description,
        string memory imageCID,
        uint256 startTime,
        uint256 endTime,
        string memory venueName,
        string memory streetAddress,
        string memory city,
        string memory state,
        string memory postalCode,
        string memory country,
        bool isOnline,
        uint256 ticketPrice,
        uint256 maxAttendees,
        EventCategory category,
        bool isPrivate
    ) external whenNotPaused returns (uint256) {
        require(startTime > block.timestamp, "Start time must be in the future");
        require(endTime > startTime, "End time must be after start time");
        require(maxAttendees > 0, "Max attendees must be greater than 0");
        require(bytes(name).length > 0, "Event name cannot be empty");

        uint256 eventId = _nextEventId++;

        events[eventId] = Event({
            eventId: eventId,
            organizer: msg.sender,
            name: name,
            description: description,
            imageCID: imageCID,
            startTime: startTime,
            endTime: endTime,
            venueName: venueName,
            streetAddress: streetAddress,
            city: city,
            state: state,
            postalCode: postalCode,
            country: country,
            isOnline: isOnline,
            ticketPrice: ticketPrice,
            maxAttendees: maxAttendees,
            ticketsSold: 0,
            status: EventStatus.Active,
            category: category,
            isPrivate: isPrivate,
            createdAt: block.timestamp,
            totalRating: 0,
            ratingCount: 0
        });

        organizerEvents[msg.sender].push(eventId);
        eventsByCategory[category].push(eventId);

        emit EventCreated(
            eventId,
            msg.sender,
            name,
            startTime,
            endTime,
            ticketPrice,
            maxAttendees,
            category
        );

        return eventId;
    }

    /**
     * @dev Updates event details (only organizer)
     */
    function updateEvent(
        uint256 eventId,
        string memory name,
        string memory description,
        uint256 startTime,
        uint256 endTime
    ) external onlyEventOrganizer(eventId) {
        Event storage eventDetails = events[eventId];
        require(eventDetails.status == EventStatus.Active, "Can only update active events");
        require(startTime > block.timestamp, "Start time must be in the future");
        require(endTime > startTime, "End time must be after start time");

        eventDetails.name = name;
        eventDetails.description = description;
        eventDetails.startTime = startTime;
        eventDetails.endTime = endTime;

        emit EventUpdated(eventId, name, startTime, endTime);
    }

    /**
     * @dev Issues a new ticket NFT with payment and platform fee
     */
    function purchaseTicket(
        bytes32 hash1,
        bytes32 hash2,
        uint256 eventId
    ) external payable nonReentrant whenNotPaused returns (uint256) {
        Event storage eventDetails = events[eventId];
        
        if (hash1 == bytes32(0) || hash2 == bytes32(0)) revert InvalidHash();
        if (eventDetails.eventId == 0) revert EventNotFound();
        if (eventDetails.status != EventStatus.Active) revert EventNotActive(eventId);
        if (block.timestamp >= eventDetails.startTime) revert EventAlreadyEnded();
        if (eventDetails.ticketsSold >= eventDetails.maxAttendees) revert EventSoldOut();
        if (msg.value != eventDetails.ticketPrice) revert InsufficientPayment();
        if (ticketExists[hash2]) revert TicketAlreadyExists(hash2);
        if (eventTickets[eventId][hash1]) revert TicketAlreadyExists(hash2);

        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);

        // Calculate platform fee
        uint256 fee = (msg.value * platformFee) / 10000;
        uint256 organizerAmount = msg.value - fee;

        // Update ticket mappings
        ticketExists[hash2] = true;
        eventTickets[eventId][hash1] = true;
        userTickets[hash1].push(tokenId);
        ticketHashes[hash2] = tokenId;
        userEvents[hash1].push(eventId);
        
        // Store ticket metadata
        ticketMetadata[tokenId] = TicketMetadata({
            eventId: eventId,
            purchaseTime: block.timestamp,
            userHash: hash1,
            isUsed: false
        });

        eventDetails.ticketsSold++;

        // Transfer payments
        if (fee > 0) {
            (bool feeSuccess, ) = payable(feeRecipient).call{value: fee}("");
            require(feeSuccess, "Failed to send platform fee");
        }
        
        (bool organizerSuccess, ) = payable(eventDetails.organizer).call{value: organizerAmount}("");
        require(organizerSuccess, "Failed to send payment to organizer");

        emit TicketIssued(tokenId, eventId, hash1, msg.value);
        return tokenId;
    }

    /**
     * @dev Marks a ticket as used for event entry
     */
    function useTicket(uint256 tokenId) external onlyEventOrganizer(ticketMetadata[tokenId].eventId) {
        TicketMetadata storage metadata = ticketMetadata[tokenId];
        if (metadata.isUsed) revert TicketAlreadyUsed();
        
        metadata.isUsed = true;
        emit TicketUsed(tokenId, metadata.eventId, block.timestamp);
    }

    /**
     * @dev Rates an event (1-5 stars)
     */
    function rateEvent(uint256 eventId, uint256 rating) external eventExists(eventId) {
        if (rating < 1 || rating > 5) revert InvalidRating();
        if (hasRated[eventId][msg.sender]) revert AlreadyRated();
        
        Event storage eventDetails = events[eventId];
        require(eventDetails.status == EventStatus.Completed, "Can only rate completed events");
        
        hasRated[eventId][msg.sender] = true;
        eventDetails.totalRating += rating;
        eventDetails.ratingCount++;
        
        emit EventRated(eventId, msg.sender, rating);
    }

    /**
     * @dev Cancels an event and enables refunds
     */
    function cancelEvent(uint256 eventId, string memory reason) external onlyEventOrganizer(eventId) {
        Event storage eventDetails = events[eventId];
        require(eventDetails.status == EventStatus.Active, "Event is not active");

        eventDetails.status = EventStatus.Cancelled;
        emit EventCancelled(eventId, reason);
    }

    /**
     * @dev Completes an event
     */
    function completeEvent(uint256 eventId) external onlyEventOrganizer(eventId) {
        Event storage eventDetails = events[eventId];
        require(eventDetails.status == EventStatus.Active, "Event is not active");
        require(block.timestamp >= eventDetails.endTime, "Event has not ended yet");

        eventDetails.status = EventStatus.Completed;
        emit EventCompleted(eventId);
    }

    /**
     * @dev Burns a ticket and issues refund if event is cancelled
     */
    function burnTicket(uint256 tokenId) external nonReentrant {
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        
        TicketMetadata storage metadata = ticketMetadata[tokenId];
        uint256 eventId = metadata.eventId;
        Event storage eventDetails = events[eventId];
        
        require(eventDetails.status == EventStatus.Cancelled, "Event not cancelled");

        // Process refund
        (bool sent, ) = payable(msg.sender).call{value: eventDetails.ticketPrice}("");
        if (!sent) revert RefundFailed();
        
        // Burn the ticket
        _burn(tokenId);
        eventDetails.ticketsSold--;
        
        emit RefundIssued(msg.sender, eventId, eventDetails.ticketPrice);
        emit TicketBurned(tokenId, eventId);
    }

    // Admin functions
    function setPlatformFee(uint256 newFee) external onlyOwner {
        if (newFee > 1000) revert InvalidFee(); // Max 10%
        uint256 oldFee = platformFee;
        platformFee = newFee;
        emit PlatformFeeUpdated(oldFee, newFee);
    }

    function setFeeRecipient(address newRecipient) external onlyOwner {
        require(newRecipient != address(0), "Invalid recipient");
        feeRecipient = newRecipient;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // View functions
    function getEventDetails(uint256 eventId) external view returns (Event memory) {
        return events[eventId];
    }

    function getEventRating(uint256 eventId) external view returns (uint256 averageRating, uint256 totalRatings) {
        Event storage eventDetails = events[eventId];
        if (eventDetails.ratingCount == 0) {
            return (0, 0);
        }
        return (eventDetails.totalRating / eventDetails.ratingCount, eventDetails.ratingCount);
    }

    function getTicketsByUser(bytes32 hash1) external view returns (uint256[] memory) {
        return userTickets[hash1];
    }

    function getUserEvents(bytes32 hash1) external view returns (uint256[] memory) {
        return userEvents[hash1];
    }

    function getEventsByCategory(EventCategory category) external view returns (uint256[] memory) {
        return eventsByCategory[category];
    }

    function verifyTicket(bytes32 hash2) external view returns (bool exists, uint256 tokenId, uint256 eventId) {
        tokenId = ticketHashes[hash2];
        if (tokenId == 0) return (false, 0, 0);
        eventId = ticketMetadata[tokenId].eventId;
        return (true, tokenId, eventId);
    }

    function isTicketUsed(uint256 tokenId) external view returns (bool) {
        return ticketMetadata[tokenId].isUsed;
    }

    // Override transfer functions to make tickets non-transferable
    function _update(address to, uint256 tokenId, address auth) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            revert("EventChain tickets are soul-bound and non-transferable");
        }
        return super._update(to, tokenId, auth);
    }

    // Token URI for metadata
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        _requireOwned(tokenId);
        
        TicketMetadata memory metadata = ticketMetadata[tokenId];
        Event memory eventDetails = events[metadata.eventId];
        
        // In a real implementation, this would return proper JSON metadata
        // For now, return a simple string
        return string(abi.encodePacked(
            "EventChain Ticket #", 
            _toString(tokenId), 
            " for ", 
            eventDetails.name
        ));
    }

    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
} 