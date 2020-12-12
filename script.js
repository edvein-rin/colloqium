var questions = [];
var filter = 'all'; // [all|theorems|formulas]

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

function invertAnswerDisplay(question){
    let answer = question.children[question.children.length - 1];
    if(answer.style.opacity == 0){
        showAnswer(question)
    }else{
        hideAnswer(question)
    }
}

function showAnswer(question){
    let answer = question.children[question.children.length - 1];
    answer.style.height = answer.scrollHeight.toString() + 'px';
    answer.style.opacity = 1;
    answer.style.padding = '8px';
}

function hideAnswer(question){
    let answer = question.children[question.children.length - 1];
    answer.style.height = 0;
    answer.style.opacity = 0;
    setTimeout( () => {answer.style.padding = 0;}, 200);
}

function updateResults(){
    let results = document.getElementById('results');

    let child = results.lastElementChild;
    while (child) { 
        results.removeChild(child); 
        child = results.lastElementChild; 
    }

    let searchString = document.getElementById('search-field').value;

    for(var i = 0, questionDict; questionDict = questions[i]; i++){
        let question = questionDict['question'];
        let answer = questionDict['answer'];
        let source = questionDict['source'];
        let potential = questionDict['potential'];
        let type = questionDict['type'];

        if(filter == 'all' || (type == 'Т' && filter == 'theorems') || (type == 'Ф' && filter == 'formulas')){
            if(question.toLowerCase().includes(searchString.toLowerCase())){
                const result =
                    `<div class="result${potential ? ' potential': ''}" onclick="invertAnswerDisplay(this)">
                        <div class="result-header">
                            <div class="result-type"${type == '' ? ' style=\"display: none;\"' : ''}><span>${type}</span></div>
                            <div class="result-question"><div>${question}</div></div>
                            ${source != '' ? '<div class=\"result-source\">' + source + '</div>' : ''}
                        </div>
                        <div class="result-answer"${searchString == '' ? '' : ' style=\"height: auto; opacity: 1; padding: 8px;\"'}>
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

function clearSearch(){
    document.getElementById('search-field').value = '';
    updateResults();
}