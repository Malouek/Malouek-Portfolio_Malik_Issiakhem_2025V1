// Blog Page Functionality

// DOM Elements
const newTopicBtn = document.querySelector('.new-topic-btn');
const newTopicModal = document.getElementById('newTopicModal');
const closeModalBtn = document.querySelector('.close-modal');
const newTopicForm = document.getElementById('newTopicForm');
const topicSearch = document.getElementById('topic-search');
const sortSelect = document.getElementById('sort-select');
const categoryLinks = document.querySelectorAll('.category-item');
const tagItems = document.querySelectorAll('.tag-item');
const forumTopics = document.querySelectorAll('.forum-topic');
const voteButtons = document.querySelectorAll('.vote-btn');

// Modal functionality
if (newTopicBtn && newTopicModal) {
    newTopicBtn.addEventListener('click', () => {
        newTopicModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    });
    
    closeModalBtn.addEventListener('click', () => {
        newTopicModal.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Close modal when clicking outside
    newTopicModal.addEventListener('click', (e) => {
        if (e.target === newTopicModal) {
            newTopicModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// New topic form submission
if (newTopicForm) {
    newTopicForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const title = document.getElementById('topicTitle').value;
        const category = document.getElementById('topicCategory').value;
        const content = document.getElementById('topicContent').value;
        const tags = document.getElementById('topicTags').value.split(',').map(tag => tag.trim());
        
        // In a real application, you would send this data to a server
        console.log('New topic:', { title, category, content, tags });
        
        // Show success message and close modal
        alert('Your topic has been posted!');
        newTopicModal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset form
        newTopicForm.reset();
    });
}

// Category filtering
categoryLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all category links
        categoryLinks.forEach(cat => cat.classList.remove('active'));
        
        // Add active class to clicked link
        link.classList.add('active');
        
        // Get selected category
        const selectedCategory = link.dataset.category;
        
        // Filter topics
        forumTopics.forEach(topic => {
            if (selectedCategory === 'all') {
                topic.style.display = 'flex';
            } else if (topic.dataset.category === selectedCategory) {
                topic.style.display = 'flex';
            } else {
                topic.style.display = 'none';
            }
        });
    });
});

// Tag filtering
tagItems.forEach(tag => {
    tag.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Get selected tag
        const selectedTag = tag.dataset.tag.toLowerCase();
        
        // Clear any active categories and set "All" as active
        categoryLinks.forEach(cat => {
            cat.classList.remove('active');
            if (cat.dataset.category === 'all') {
                cat.classList.add('active');
            }
        });
        
        // Display only topics with this tag
        const hasTaggedTopics = Array.from(forumTopics).some(topic => {
            const topicTags = Array.from(topic.querySelectorAll('.topic-tags .tag-item'))
                .map(tagEl => tagEl.textContent.toLowerCase());
            
            if (topicTags.includes(selectedTag)) {
                topic.style.display = 'flex';
                return true;
            } else {
                topic.style.display = 'none';
                return false;
            }
        });
        
        // If no topics with this tag, show all
        if (!hasTaggedTopics) {
            forumTopics.forEach(topic => topic.style.display = 'flex');
        }
    });
});

// Search functionality
if (topicSearch) {
    topicSearch.addEventListener('input', debounce(function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            forumTopics.forEach(topic => topic.style.display = 'flex');
            return;
        }
        
        forumTopics.forEach(topic => {
            const title = topic.querySelector('.topic-title').textContent.toLowerCase();
            const excerpt = topic.querySelector('.topic-excerpt').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || excerpt.includes(searchTerm)) {
                topic.style.display = 'flex';
            } else {
                topic.style.display = 'none';
            }
        });
    }, 300));
}

// Sort functionality
if (sortSelect) {
    sortSelect.addEventListener('change', () => {
        const sortOption = sortSelect.value;
        const topicsArray = Array.from(forumTopics);
        const topicsContainer = document.querySelector('.blog-posts');
        
        // Sort topics based on selected option
        topicsArray.sort((a, b) => {
            if (sortOption === 'recent') {
                // Sort by date (newest first)
                const dateA = a.querySelector('.topic-date').textContent;
                const dateB = b.querySelector('.topic-date').textContent;
                return compareDates(dateB, dateA);
            } else if (sortOption === 'popular') {
                // Sort by votes (highest first)
                const votesA = parseInt(a.querySelector('.vote-count').textContent);
                const votesB = parseInt(b.querySelector('.vote-count').textContent);
                return votesB - votesA;
            } else if (sortOption === 'comments') {
                // Sort by number of comments (highest first)
                const commentsA = parseInt(a.querySelector('.topic-comments').textContent.match(/\d+/)[0]);
                const commentsB = parseInt(b.querySelector('.topic-comments').textContent.match(/\d+/)[0]);
                return commentsB - commentsA;
            }
            return 0;
        });
        
        // Re-append sorted topics to container
        topicsArray.forEach(topic => {
            topicsContainer.appendChild(topic);
        });
    });
}

// Vote functionality
voteButtons.forEach(button => {
    button.addEventListener('click', function() {
        const voteCountElement = this.parentElement.querySelector('.vote-count');
        let voteCount = parseInt(voteCountElement.textContent);
        
        // Check if upvote or downvote
        if (this.querySelector('.fa-chevron-up')) {
            voteCount++;
        } else {
            voteCount--;
        }
        
        // Update UI
        voteCountElement.textContent = voteCount;
        
        // Add animation
        voteCountElement.classList.add('vote-update');
        setTimeout(() => {
            voteCountElement.classList.remove('vote-update');
        }, 300);
        
        // In a real application, you would send this vote to a server
    });
});

// GSAP Animations for blog page
gsap.set('.forum-topic', { opacity: 0, y: 20 });

ScrollTrigger.batch('.forum-topic', {
    interval: 0.1,
    batchMax: 4,
    onEnter: batch => gsap.to(batch, {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out"
    }),
    start: "top 85%"
});

// Utility function for debouncing search
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Utility function to compare date strings
function compareDates(dateA, dateB) {
    // Simple date comparison for strings like "2 hours ago" or "3 days ago"
    // In a real application, you would store and compare actual timestamps
    const unitsA = dateA.match(/(\d+)\s+(\w+)/);
    const unitsB = dateB.match(/(\d+)\s+(\w+)/);
    
    if (!unitsA || !unitsB) return 0;
    
    const valueA = parseInt(unitsA[1]);
    const valueB = parseInt(unitsB[1]);
    const unitA = unitsA[2];
    const unitB = unitsB[2];
    
    // Convert to hours for comparison
    const getHours = (value, unit) => {
        switch(unit) {
            case 'minute':
            case 'minutes':
                return value / 60;
            case 'hour':
            case 'hours':
                return value;
            case 'day':
            case 'days':
                return value * 24;
            case 'week':
            case 'weeks':
                return value * 24 * 7;
            case 'month':
            case 'months':
                return value * 24 * 30;
            default:
                return value;
        }
    };
    
    return getHours(valueA, unitA) - getHours(valueB, unitB);
}
