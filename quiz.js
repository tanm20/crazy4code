(function() {
    /*************************************************************************
    This should be the full address to your quiz, in order for the result
    codes to link to it.

    *************************************************************************/
    var QUIZ_URL = "/quiz.html";

    /*************************************************************************
    This should be the full address to whatever folder on your website
    directly contains your result images, ending in a forward slash.

    *************************************************************************/
    var RESULTS_FOLDER_URL = "/results/";

    /*************************************************************************
    The pairs between brackets should be the names of personality traits that
    you use as the value attribute of the answer radio buttons. Each pair
    should consist of two opposite traits, such as extravert and introvert or
    stoic and emotional. You can have any number of trait pairs, although be
    warned that each trait pair doubles the number of results.

    *************************************************************************/
    var TRAIT_PAIRS = [["trait1", "trait2"], ["trait3", "trait3"]];

    /*************************************************************************
    Below, enter the possible final results for your quiz.

    The string inside the brackets should consist of one trait from each of
    the trait pairs defined above, in the order in which they're defined,
    joined by ampersands. Thus, if the trait pairs are ["introvert",
    "extravert"] and ["stoic", "emotional"], your results should be
    "introvert&stoic", "introvert&emotional", "extravert&stoic" and
    "extravert&emotional". You need to include one result for each possible
    combination of traits - that means 2^n results if you have n trait pairs.
    If that seems too much, this may not be the quiz for you.

    Where it says "Result 1", "Result 2", etc., enter the full name of the
    result, such as "Alakazam". Where it says "result_1.jpg", "result_2.jpg",
    etc., enter the filename of the image the user should be presented with if
    they get that result. Where it says "Text for the first result", "Text for
    the second result", etc., enter the text the user should be presented with
    if they get that result. (If you do not want them to get any text with
    their result, you can erase those lines altogether.) Remember to enclose
    these values in quotes.

    It is also possible to leave out the name, image and text and instead add
    a link property, like so:

    RESULTS["introvert&stoic"] = {
        link: "/quiz/alakazam.html"
    };

    If you do this, then the user will be redirected to the link for their
    result when they finish the quiz. The link, like a regular HTML link, can
    be a full URL or an absolute or relative path on your server.

    Optionally, you can add extra results where "both" is used in place of a
    trait in the result identifier, to represent a tie between the two
    extremes. If you don't include a "both" result, the trait that comes first
    in the definition of the trait pairs will take precedence (that is, if
    you have no result for "both&stoic", then a user with a tie between
    introvert and extravert but more stoic than emotional will get the result
    "introvert&stoic" if "introvert" comes before "extravert" in the trait
    pairs).

    *************************************************************************/

    var RESULTS = {};

    RESULTS["trait1&trait3"] = {
        name: "High Narcissism",
        text:"You're such a narcissist",
        image: "narc.jpg",
        text: "Individuals who score high on narcissism display grandiosity, entitlement, dominance, and superiority."
    };

    RESULTS["trait1&trait2"] = {
        name: "High Machiavellianism",
        image: "mach.jpg",
        text: "People who score high on this trait are cynical (in an amoral self-interest sense, not in a doubtful or skeptical sense), unprincipled, believe in interpersonal manipulation as the key for life success, and behave accordingly"
    };

    RESULTS["trait2&trait3"] = {
        name: "High Psychopathy",
        image: "psych.jpg",
        text: "Individuals who score high on psychopathy show low levels of empathy combined with high levels of impulsivity and thrill-seeking"
    };


    /*************************************************************************
    If for some reason you need to give your form a different name attribute
    than "quizform", enter it here. Otherwise, leave this alone.

    *************************************************************************/
    var FORM_NAME = 'quizform';

    /*************************************************************************
    DO NOT EDIT ANYTHING BELOW THIS POINT

    *************************************************************************/

    var form = document.forms[FORM_NAME];
    var form_elements = document.forms[FORM_NAME].elements;
    var form_element;
    var result_div = document.getElementById("result_div");
    var result_image = document.getElementById("result_image");
    var result_text = document.getElementById("result_text");
    var i;

    var traits = {};

    for (i = 0; i < TRAIT_PAIRS.length; i++) {
        if (TRAIT_PAIRS[i].length !== 2) {
            alert("You have more than two traits in a pair. Please ensure that each of the inner sets of square brackets have only two values between them.");
        }
        for (var j = 0; j < 2; j++) {
            traits[TRAIT_PAIRS[i][j]] = true;
        }
    }

    function get_trait_combo(index) {
        var traits = [];
        for (var i = 0; i < TRAIT_PAIRS.length; i++) {
            traits.push(TRAIT_PAIRS[i][(index >> i) % 2]);
        }
        return traits;
    }

    for (i = 0; i < Math.pow(2, TRAIT_PAIRS.length); i++) {
        var result_identifier = get_trait_combo(i).join('&');
        if (!RESULTS[result_identifier]) {
            alert("You have not defined a result for " + result_identifier + ". Please double-check your result definitions.");
        }
    }

    // Validate the quiz form to prevent common issues
    for (i = 0; i < form_elements.length; i++) {
        form_element = form_elements[i];
        if (form_element.type === "radio" || form_element.type === "checkbox") {
            if (form_element.value.indexOf('&') !== -1) {
                alert("Your quiz form has an answer with an ampersand in the value (" + form_element.value + "). This will cause problems. Please change this value.");
            }
            else if (!(form_element.value in traits)) {
                alert("Your quiz form has an answer with the value " + form_element.value + " but this value is not in your trait pairs. You probably made a typo or set your trait pairs up incorrectly.");
            }
        }
    }

    form.onsubmit = function() {
        var answers = {};
        var results = [];
        var first_trait;
        var second_trait;
        var joined_results;
        var result;
        var i;

        for (var trait in traits) {
            answers[trait] = 0;
        }

        for (i = 0; i < form_elements.length; i++) {
            form_element = form_elements[i];
            if ((form_element.type === "radio" || form_element.type === "checkbox") && form_element.checked) {
                answers[form_element.value]++;
            }
        }

        for (i = 0; i < TRAIT_PAIRS.length; i++) {
            first_trait = TRAIT_PAIRS[i][0];
            second_trait = TRAIT_PAIRS[i][1];
            if (answers[first_trait] > answers[second_trait]) {
                results.push(first_trait);
            }
            else if (answers[first_trait] < answers[second_trait]) {
                results.push(second_trait);
            }
            else {
                results.push("both");
            }
        }

        joined_results = results.join('&');
        if (!(joined_results in RESULTS)) {
            // No specific result
            for (var i = 0; i < results.length; i++) {
                if (results[i] === "both") {
                    results[i] = TRAIT_PAIRS[i][0];
                }
            }
            joined_results = results.join('&');
        }
        result = RESULTS[joined_results];

        if (result.link) {
            window.location = result.link;
            return false;
        }

        if (result_image) {
            result_image.src = RESULTS_FOLDER_URL + result.image;
            result_image.setAttribute('alt', result.name);
            if (result.text) result_image.title = result.text;
        }
        if (result_text && result.text) {
            result_text.innerHTML = result.text;
        }

        result_div.style.display = 'block';
        return false;
    };
})();

/*************************************************************************
Free quiz script from The Cave of Dragonflies:
http://www.dragonflycave.com/free-quiz-scripts
*************************************************************************/

/****quiz transition script ****/
