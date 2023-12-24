async function extractDetails(detections){
    
    const text = detections.description;
    console.log(text);
    text.replace((/[^a-zA-Z0-9 ]/g, ''));
    const dateRegex = /\b\d{1,2}\s*(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{2,4}\b/g;

// Extract dates from the text using the regular expression
    const extractedDates = text.match(dateRegex) || [];
    const dateObjects = extractedDates.map((dateString) => new Date(dateString.replace('.', '')));

    // Sort the Date objects
    dateObjects.sort((a, b) => a - b);

    // Convert back to formatted date strings
    const sortedDates = dateObjects.map((date) => {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month}. ${year}`;
    });

    // console.log('Sorted Dates:', sortedDates);

    // const identification_num = extractIdentification(detections);
    const numericValueRegex  = /\b(\d(?:\s*\d{1,12})?)\b/;


// Extract the numeric value using the regular expression
    const match = text.match(numericValueRegex);

// Extracted numeric value
    const identification_num = match ? match[1] : null;

    
    const nameToLastRegex = /Name\s([^]+?)(?=\s+Last|$)/i;

    // Regular expression to match a single word after "Last name" (case-insensitive)
    const lastNameRegex = /Last name\s(\S+)/i;

    // Extract words after "Name" until the last word is seen, excluding the word "Last"
    const nameToLastMatch = text.match(nameToLastRegex);
    const Name = nameToLastMatch ? nameToLastMatch[1] : null;

    // Extract a single word after "Last name"
    const lastNameMatch = text.match(lastNameRegex);
    const LastName = lastNameMatch ? lastNameMatch[1] : null;



if(sortedDates.length=== 3 && Name != null && LastName != null && identification_num != null)
return {
    IdentificationNumber : identification_num,
    Name:Name,
    LastName : LastName,
    DOB : sortedDates[0],
    DataOfIssue : sortedDates[1],
    DateOfExpiry : sortedDates[2]
}

return {
    IdentificationNumber : identification_num,
    Name:Name,
    LastName : LastName,
    DOB : sortedDates[0],
    DataOfIssue : sortedDates[1],
    DateOfExpiry : sortedDates[2]  
}

async function extractIdentification(text)
{
     // Regular expression to match the first numeric value with gaps (up to 13 digits)
    // const numericValueRegex = /\b(\d(?:\s*\d+)*)\b/;
    const numericValueRegex  = /\b(\d(?:\s*\d{1,12})?)\b/;


// Extract the numeric value using the regular expression
    const match = text.match(numericValueRegex);

// Extracted numeric value
    const identification_num = match ? match[1] : null;

    return identification_num;
}

}
module.exports = {extractDetails}