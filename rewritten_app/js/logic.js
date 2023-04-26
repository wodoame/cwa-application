// below are global variables that store data that need to be remembered as long as a user is on the site
let form = document.getElementById('form'); 
let progress_bar = document.getElementById('progress_bar');
let history_div = document.getElementById('history');
let sigmas = [];  
let form_is_valid = true;
let credit_records = [];
let allow_semesters_active_increment, current_total_credits, current_sigma_obtained, note;
let history = "";


// PREVENT FORM REFRESH
function handleForm(event){
    event.preventDefault();
}

form.addEventListener('submit', handleForm);


// CWA CALCULATION
function calculate(){
        let score_fields = document.getElementsByName('score_field');
        let credit_fields = document.getElementsByName('credit_field');
        current_total_credits = 0; 
        current_sigma_obtained = 0; 

        for(let i=0; i < score_fields.length ; i++ ){
            if(!score_fields[i].checkValidity() || !credit_fields[i].checkValidity()){
                form_is_valid = false;
                break;
            }
            let x = parseInt(score_fields[i].value); 
            let y = parseInt(credit_fields[i].value); 

                current_total_credits += y; 
                current_sigma_obtained += x * y;
            }
        

        let sigmas_sum = sigmas.reduce((accumulator, value) =>{return accumulator + value;}, 0) + current_sigma_obtained; 
        let credit_records_sum  = credit_records.reduce((accumulator, value) => {return accumulator + value;}, 0) + current_total_credits; 
        let cwa = parseFloat((sigmas_sum / credit_records_sum).toFixed(2));
        let swa = parseFloat((current_sigma_obtained/current_total_credits).toFixed(2));
        if(form_is_valid){
        document.getElementById('results').innerHTML = '\nswa = ' + swa.toString() + '\ncwa = ' + cwa.toString();
        history = cwa.toString();
        progress(cwa);
        
        allow_semesters_active_increment = true;
        }
    
        form_is_valid = true; // incase the value is false
    }


// SAVING AND CONTINUE BUTTON ACTION
function increment(){
    if(allow_semesters_active_increment){
        let current_value = document.getElementById('semesters_active').innerHTML;
        document.getElementById('semesters_active').innerHTML = parseInt(current_value) + 1;
        document.getElementById('modal_message').innerHTML = 'SAVED: 1 semester added';
        $('#normal_modal').modal('show');
        
        history_div.setAttribute('class', 'form-control is-valid');
        let current_history = history_div.innerHTML;
        if(current_history == ""){
            history_div.innerHTML = "cwa dynamics = " + history;
        }
        else{
            history_div.innerHTML = current_history + " --> " + history;
            
        }
        
        sigmas.push(current_sigma_obtained); 
        credit_records.push(current_total_credits);
        allow_semesters_active_increment = false;

    }
    else {
        document.getElementById('modal_message').innerHTML = 'ALERT: no calculations done yet';
        $('#normal_modal').modal('show');
    }
    
}


// DELETE ONE SEMESTER BUTTON ACTION
function decrement(){
    
    let current_value = document.getElementById('semesters_active').innerHTML;
    if(current_value != 0){
        document.getElementById('semesters_active').innerHTML = parseInt(current_value) - 1;
        document.getElementById('modal_message').innerHTML = 'DELETED: 1 semester removed';
        $('#normal_modal').modal('show');
        if(parseInt(current_value) - 1 == 0){
            history_div.setAttribute('class', 'form-control'); 
            history_div.innerHTML = ""; 
        }
        else{
            let text = history_div.innerHTML;
            let i = text.lastIndexOf("--");
            history_div.innerHTML = history_div.innerHTML.slice(0, i - 1);
        }
        
        sigmas.pop();
        credit_records.pop();

    }
    else{
        document.getElementById('modal_message').innerHTML = 'ALERT: no existing semesters';
        $('#normal_modal').modal('show');
    }
    
}


//DELETE ALL SEMESTERS BUTTON ACTION 
function initialize(){
    let current_value = document.getElementById('semesters_active').innerHTML;
    if(current_value > 0){
        document.getElementById('semesters_active').innerHTML = 0;
        document.getElementById('modal_message').innerHTML = 'DELETED: all semesters removed';
        $('#normal_modal').modal('show');
        history_div.setAttribute('class', 'form-control'); 
        history_div.innerHTML = ""; 
        sigmas = [];
        credit_records = [];
    }
    else{
        document.getElementById('modal_message').innerHTML = 'ALERT: no existing semesters';
        $('#normal_modal').modal('show');
    }
}


// DELETE A ROW
function delete_row(r){
    let grandParentNode = r.parentNode.parentNode;
    let i = grandParentNode.rowIndex;
    let value = document.getElementById('course_count').innerHTML;
    if(i == 1 && grandParentNode.nextElementSibling == null){
        document.getElementById('modal_message').innerHTML = 'FORBIDDEN: cannot remove all input fields';
        $('#normal_modal').modal('show');
    }
    else{
        document.getElementById("main_table").deleteRow(i);
        document.getElementById('course_count').innerHTML = parseInt(value) - 1; 
    }
}


// ADD A ROW
function append_row(){
    let template = document.getElementById('row_duplicate'); 
    let value = document.getElementById('course_count').innerHTML;
    document.getElementById('main_table').insertRow(-1).innerHTML = template.innerHTML;
    document.getElementById('course_count').innerHTML = parseInt(value) + 1;
}


// CLEARING OF RESULTS AND INPUT FIELDS
function clear_results(){
    document.getElementById('results').innerHTML = "";
    let fields = document.getElementsByTagName('input');
    for(let i=0; i <fields.length ; i ++){
        fields[i].setAttribute('class', 'form-control');
    }
    progress_bar.setAttribute('style', 'width:0%');
}

// REAL-TIME BOOTSTRAP VALIDATION
function check(r){
    if(r.value == ""){
        r.setAttribute('class', 'form-control');
    }
    else if(r.checkValidity()){

        r.setAttribute('class', 'form-control is-valid');

    }
    else{
        r.setAttribute('class', 'form-control is-invalid');
    }
}


// PROGRESS BAR
function progress(r){
    let value = r;
    if(value >= 80){

        progress_bar.setAttribute('class', 'progress-bar bg-success');
    
    }
    else if(value >= 75 && value < 80){
        progress_bar.setAttribute('class', 'progress-bar bg-info');
    }
    else if(value >= 60 && value < 75){

        progress_bar.setAttribute('class', 'progress-bar bg-warning');
    }
    else{
        progress_bar.setAttribute('class', 'progress-bar bg-danger'); 
    }

    value = value.toString();
    progress_bar.setAttribute('style', 'width:'+ value + '%');
}