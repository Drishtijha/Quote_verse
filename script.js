
const quoteText = document.getElementById("quoteText");
const quoteAuthor = document.getElementById("quoteAuthor");
const generateButton = document.getElementById("generateBtn");
const copyButton = document.getElementById("copyBtn");

const favoriteBtn = document.getElementById("favoriteBtn");
const favoriteLabel = document.getElementById("favoriteLabel");
const favoriteCount = document.getElementById("favoriteCount");
const favoritesList = document.getElementById("favoritesList");

// Generate a random quote
async function generateQuote() {
    try {
        generateButton.disabled = true;
        generateButton.textContent = "Loading...";

        const response = await fetch("https://dummyjson.com/quotes");
        
        if (!response.ok) {
            throw new Error("Failed to fetch quotes");
        }

        const data = await response.json();
        const randomQuote =
            data.quotes[Math.floor(Math.random() * data.quotes.length)];

        quoteText.textContent = randomQuote.quote;
        quoteAuthor.textContent = "— " + randomQuote.author;

        const colors = ["#FF5733", "#33FF57", "#3357FF", "#F333FF", "#FF33A1", "#33FFF5" , "#F5FF33", "#FF8C33", "#8C33FF", "#33FF8C" , "#FF3333", "#33FF33", "#3333FF", "#FF33FF", "#33FFFF", "#FFFF33" , "#FF6633", "#6633FF", "#33FF66", "#FF3366" , "#3366FF", "#FF33CC", "#33CCFF", "#CCFF33", "#FFCC33" , "#CC33FF", "#33FFCC", "#FF9933", "#9933FF", "#33FF99" , "#FF3399", "#3399FF", "#99FF33", "#FF66CC", "#66CCFF" , "#CC66FF", "#66FFCC", "#FF9966", "#9966FF" , "#66FF99"
   ];

        const randomColor =
            colors[Math.floor(Math.random() * colors.length)];

        quoteText.style.color = randomColor;

    } catch (error) {
        console.error("Error:", error);
        quoteText.textContent = "Unable to load quote. Please try again.";
        quoteAuthor.textContent = "";
    } finally {
        generateButton.disabled = false;
        generateButton.textContent = "Generate Quote";
    }
}

// Copy quote to clipboard
async function copyToClipboard() {
    try {
        const text = `${quoteText.textContent} ${quoteAuthor.textContent}`;
        await navigator.clipboard.writeText(text);

        copyButton.textContent = "Copied!";

        setTimeout(() => {
            copyButton.textContent = "Copy";
        }, 2000);
    } catch (error) {
        console.error("Copy failed:", error);
        alert("Copy failed. Please try again.");
    }
}

//Function to share the quote 

function shareQuote() {
    const quote = quoteText.textContent;
    const author = quoteAuthor.textContent;
    const text = `${quote} ${author}`;

    if (navigator.share) {
        navigator.share({
            title: "Inspiring Quote",
            text: text
        }).catch(error => {
            if (error.name !== "AbortError") {
                console.error("Share failed:", error);
            }
        });
    } else {
        const shareURL =
            "https://wa.me/?text=" + encodeURIComponent(text);

        window.open(shareURL, "_blank");
    }
}

let favorites = JSON.parse(
    localStorage.getItem("favoriteQuotes") || "[]"
);

// Save favourites and render the list
function updateFavorites() {
    localStorage.setItem(
        "favoriteQuotes",
        JSON.stringify(favorites)
    );

    favoriteCount.textContent = favorites.length;
    favoritesList.replaceChildren();

    if (favorites.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "favorites-empty";
        emptyMessage.textContent =
            "No favorite quotes yet. Add your first quote ❤️";

        favoritesList.appendChild(emptyMessage);
        return;
    }

    favorites.forEach((item, index) => {
        // Create a new card
        const card = document.createElement("article");
        card.className = "favorite-card";

        // Quote text
        const quote = document.createElement("p");
        quote.className = "favorite-card-quote";
        quote.textContent = `“${item.quote}”`;

        // Author name
        const author = document.createElement("p");
        author.className = "favorite-card-author";
        author.textContent = item.author;

        // Remove button
        const removeBtn = document.createElement("button");
        removeBtn.className = "favorite-remove-btn";
        removeBtn.textContent = "Remove ❤️";
        removeBtn.type = "button";

        removeBtn.addEventListener("click", () => {
            favorites.splice(index, 1);
            updateFavorites();
            updateFavoriteButton();
        });

        card.append(quote, author, removeBtn);
        favoritesList.appendChild(card);
    });
}

// Check whether current quote is already saved
function isFavorite(quote, author) {
    return favorites.some(
        item => item.quote === quote &&
                item.author === author
    );
}

// Update main Favourite button label
function updateFavoriteButton() {
    const quoteText = document.getElementById("quoteText");
    const quoteAuthor = document.getElementById("quoteAuthor");

    if (!quoteText || !quoteAuthor) return;

    const quote = quoteText.textContent.trim();
    const author = quoteAuthor.textContent.trim();

    const exists = isFavorite(quote, author);

    favoriteLabel.textContent = exists
        ? "Added to Favorites ❤️"
        : "Add to Favorites";
}

// Add or remove the current quote
favoriteBtn.addEventListener("click", () => {
    const quoteText = document.getElementById("quoteText");
    const quoteAuthor = document.getElementById("quoteAuthor");

    const quote = quoteText.textContent.trim();
    const author = quoteAuthor.textContent.trim();

    if (!quote || quote === "Loading...") return;

    if (isFavorite(quote, author)) {
        favorites = favorites.filter(
            item => !(item.quote === quote &&
                      item.author === author)
        );
    } else {
        favorites.push({ quote, author });
    }

    updateFavorites();
    updateFavoriteButton();
});

// Initial display
updateFavorites();
updateFavoriteButton();


document.getElementById("shareBtn")
    .addEventListener("click", shareQuote);
generateButton.addEventListener("click", generateQuote);
copyButton.addEventListener("click", copyToClipboard);
shareBtn.addEventListener("click", shareQuote);
