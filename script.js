const DEBUG = false;

var questions = [];
var filter = 'all'; // [all|theorems|formulas]
var timeUntilSearchResultsAreUpdated = 200; // ms
var wasNewSearchRequest = false;
var searchTimeout = null;

window.addEventListener('load', (e) => {
    if (DEBUG) {
        document.getElementById('search-field').value = 'all';
        updateResults();

        function scrollToBottom() {
            window.scrollTo(0, document.body.scrollHeight)
        }

        const results = document.querySelectorAll('.result')
        results.forEach(result => {
            const isTheLastResult = Array.prototype.indexOf.call(results, result) === results.length - 1
            setTimeout(() => {
                showAnswer(result)
                if (isTheLastResult) {
                    setTimeout(() => {scrollToBottom()}, timeUntilSearchResultsAreUpdated + 1)
                }
            }, timeUntilSearchResultsAreUpdated)
        });
    }
})

function loadQuestions(){
    let questionList = document.getElementById('question-list');
    let children = questionList.children;

    for(let i = 0, child; child = children[i]; i++){
        let classes = child.classList;

        let question = (' ' + child.children[0].innerHTML).slice(1);
        let answer = (' ' + child.children[1].innerHTML).slice(1);
        var source = '';
        if(child.children.length >= 3){
            source = (' ' + child.children[2].innerHTML).slice(1);
        }


        questions.push({
            'question': question,
            'answer': answer,
            'source': source,
            'potential': classes.contains('potential'),
            'type': classes.contains('theorem') ? 'Т' : (classes.contains('formula') ? 'Ф' : '')
        });

    }

    questionList.remove();

}

function invertAnswerDisplay(result){
    let answer = result.children[result.children.length - 1];
    if(answer.style.opacity == 0){
        showAnswer(result)
    }else{
        hideAnswer(result)
    }
}

function showAnswer(result){
    let answer = result.children[result.children.length - 1];
    answer.style.height = answer.scrollHeight.toString() + 'px';
    answer.style.opacity = 1;
    answer.style.padding = '8px';
}

function hideAnswer(result){
    let answer = result.children[result.children.length - 1];
    answer.style.height = 0;
    answer.style.opacity = 0;
    setTimeout( () => {answer.style.padding = 0;}, 200);
}

function onSearchInputUpdate(){
    wasNewSearchRequest = true;
    if(!searchTimeout){
        searchTimeout = setTimeout(searchTimeoutFunction, timeUntilSearchResultsAreUpdated);
    }
}

function searchTimeoutFunction(){
    if(wasNewSearchRequest){
        console.log('Extended');
        wasNewSearchRequest = false;
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(searchTimeoutFunction, timeUntilSearchResultsAreUpdated);
    }else{
        searchTimeout = null;
        updateResults();
    }
}

function updateResults(){
    let results = document.getElementById('results');

    let child = results.lastElementChild;
    while (child) { 
        results.removeChild(child); 
        child = results.lastElementChild; 
    }

    let searchString = document.getElementById('search-field').value;
    let isAll = searchString == 'all' || searchString == 'все' || searchString == 'всі';

    if(searchString != '' || isAll){
        for(var i = 0, questionDict; questionDict = questions[i]; i++){
            let question = questionDict['question'];
            let answer = questionDict['answer'];
            let source = questionDict['source'];
            let potential = questionDict['potential'];
            let type = questionDict['type'];

            if(filter == 'all' || (type == 'Т' && filter == 'theorems') || (type == 'Ф' && filter == 'formulas')){
                if(question.toLowerCase().includes(searchString.toLowerCase()) || isAll){
                    const result =
                        `<div class="result${potential ? ' potential': ''}" onclick="invertAnswerDisplay(this)">
                            <div class="result-header">
                                <div class="result-type"${type == '' ? ' style=\"display: none;\"' : ''}><span>${type}</span></div>
                                <div class="result-question"><div>${question}</div></div>
                                ${source != '' ? '<div class=\"result-source\">' + source + '</div>' : ''}
                            </div>
                            <div class="result-answer"${isAll ? '' : ' style=\"height: auto; opacity: 1; padding: 8px;\"'}>
                                ${answer}
                            </div>
                        </div>`// onmouseenter="showAnswer(this)" onmouseleave="hideAnswer(this)"

                    results.insertAdjacentHTML('beforeend', result);
                }
            }

        }

        MathJax.texReset();
        MathJax.typesetClear();
        MathJax.typesetPromise()
            .catch(function (err) {
              output.innerHTML = '';
              output.appendChild(document.createElement('pre')).appendChild(document.createTextNode(err.message));
            })

    }

}

function clearSearch(){
    document.getElementById('search-field').value = '';
    updateResults();
}