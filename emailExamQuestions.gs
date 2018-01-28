function emailExamQuestions() {
  
  var responses_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]
  var last_row = responses_sheet.getLastRow();
  var last_column = responses_sheet.getLastColumn();
  
  var data = responses_sheet.getSheetValues(1, 1, last_row, last_column);
  var email_address = data[last_row - 1][2];
  var full_name = data[last_row - 1][3];
  var first_name = full_name.split(" ")[0];
  var intro = first_name + ",\n\n";
  intro += "Here are your questions for the culminating exam.\n\n";
  var instructions = "(Instructions to student for submitting their responses to the provided questions.)\n\n";
  var signoff = "Good luck!" + "\n" + "- Julie\n\n"
  
  var chosen_modules = data[last_row - 1][1];
  var questions = getMatchingQuestions(chosen_modules);
  
  body = intro + instructions + signoff + questions;
  
  // concatenate questions to email, put questions in separate spreadsheet
  
  
  MailApp.sendEmail(email_address, "ELPA 502: Culminating Exam Questions", body);
  
}



function getMatchingQuestions(data_from_modules_cell) {
 
  separated_modules = data_from_modules_cell.split(", ");
  
  all_questions = ""
  
  for (idx in separated_modules) {
    
    // start with string of module name
    var module = separated_modules[idx];
    
    // get matching questions
    
    // open spreadsheet with bank of culminating questions / prompts
    var questions_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[1];
    
    // determine corresponding id number for this module
    
    // only get data for names of modules; counter will match id number
    var modules_from_key = questions_sheet.getSheetValues(2, 2, 20, 1);
        
    // get module index to use for finding matching questions
    var module_index = getModuleNumber(modules_from_key, module);
    
    // collect list of questions that match this module
    
    var question_mappings = questions_sheet.getSheetValues(2, 4, -1, 2);
    
    var question_options = getPossibleQuestions(module_index, question_mappings);
    
    var random_question = question_options[Math.floor(Math.random() * question_options.length)];
    
    var header = "========== QUESTION " + (parseInt(idx) + 1) + " =========="
    
    question = header + "\n\n" + module + ":\n\n" + random_question + "\n\n";
    
    // add to list of all questions
    all_questions += question;
    
  }
    
  return all_questions + "\n\n========== END QUESTIONS ==========";
    
}
  

function getModuleNumber(modules_list, target_module) {
    
    for (i = 0; i < modules_list.length; i++) { 
      if (modules_list[i].toString().trim() === target_module.toString().trim()) { return i + 1 };
    }
    
    Logger.log("No match found! Something is wrong. Please contact Julie about this.");
    return -999;
}


// for this module index, loop through all questions
function getPossibleQuestions(module_index, question_key_mappings) {
  
  var possible_questions = [];
  
  // iterating through number, question pairs
  for (i = 0; i < question_key_mappings.length; i++) {
    
    // if module number matches, add this question to list of options
    if (question_key_mappings[i][0] == module_index ) {
      possible_questions.push(question_key_mappings[i][1]);
    }
    
  }
  
  return possible_questions;
  
}