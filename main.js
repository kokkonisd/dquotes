var twitterUrl = 'https://twitter.com/intent/tweet?hashtags=designquotes&related=freecodecamp&text=';
var quotesUrl = 'https://quotesondesign.com/wp-json/wp/v2/posts/?orderby=rand';
var darkLimit = 40;
var animationSpeed = 500;

function treatQuoteText (text) {
    return text.replace(/<p>/g, "").replace(/<\/p>/g,"")
        .replace(/\n/g, "")
        .trim();
}

function toTwitter (quote) {
    return quote.replace(/<em>/g, '').replace(/<\/em>/g, '')
        .replace(/&#8211;/g, '-').replace(/<strong>/g, '')
        .replace(/<\/strong>/g, '').replace(/&#8230;/g, '...')
        .replace(/&#8217;/g, '\'').replace(/&#8220;/g, '"')
        .replace(/&#8221;/g, '"').replace(/<sup>/g, '^')
        .replace(/<\/sup>/g, '').replace(/<br \/>/g, '\n')
        .replace(/<br\/>/g, '\n').replace(/<br>/g, '\n')
        .replace(/&#8216;/g, "'").replace(/<small>/g, '')
        .replace(/<\/small>/g, '');
}

function setBgToRandomColor () {
    // generate random colors
    do {
        var red = Math.floor(Math.random() * 255);
        var green = Math.floor(Math.random() * 255);
        var blue = Math.floor( Math.random() * 255);

        // per ITU-R BT.709
        var luma = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
    } while (luma < darkLimit);

    // animate the color change
    $("body").animate({
        backgroundColor: "rgb(" + red + "," + green + "," + blue + ")"
    }, animationSpeed);
}

function hideQuoteText () {
    $(".the-quote").animate({
        opacity: 0
    }, animationSpeed);

    $(".the-author").animate({
        opacity: 0
    }, animationSpeed);
}

function showQuoteText () {
    $(".the-quote").animate({
        opacity: 1
    }, animationSpeed);

    $(".the-author").animate({
        opacity: 1
    }, animationSpeed);
}

$(document).ready(function() {
    // initialize the quote and author variables
    var currentQuote = "";
    var currentAuthor = "";
    
    // when the new quote button is clicked
    $(".new-quote").on("click", function () {
        // hide the quote text
        hideQuoteText();
        
        // make an ajax request
        $.ajax( {
            // get a new quote
            url: quotesUrl,
            // if succeeded
            success: function(data) {
                // grab the first quote from the array
                var quote = data.shift();
                // treat the quote text and store it
                currentQuote = treatQuoteText(quote.content.rendered);
                // store the author's name
                currentAuthor = quote.title.rendered;
          
                // set the html elements to the quote & author text
                $(".the-quote").html('"' + currentQuote+ '"');
                $(".the-author").html(currentAuthor);
          
                // assign the attribute to the twitter link
                $('#tweet-quote').attr('href', twitterUrl + 
                    encodeURIComponent('"' + toTwitter(currentQuote) + '" ' + currentAuthor));

                // show the quote text
                showQuoteText();

                // change the background color
                setBgToRandomColor();
            },
            cache: false
        });
    });
    
    // when the page is loaded, generate a new quote
    $(".new-quote").click();
});     
