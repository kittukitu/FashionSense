const fetch = require('node-fetch');

exports.sendThresholdNotification = async (email, jobTitle, companyName) => {
  const url = 'https://mail-sender-api1.p.rapidapi.com/';
  const options = {
    method: 'POST',
    headers: {
      'x-rapidapi-key': 'd95138bcccmsh5d35a3a49ecb578p17c5b4jsn72168f34851e',
      'x-rapidapi-host': 'mail-sender-api1.p.rapidapi.com',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      sendto: email,  
      name: 'user2024',
      replyTo: 'sb1974660@gmail.com', 
      ishtml: 'false',
      title: 'Application Successful!',
      body: `Thank you for applying for the ${jobTitle} position at ${companyName}. We have received your application and will review it carefully. Our team will contact you if your profile matches our requirements for the next steps. \n We appreciate your interest in joining our team and will be in touch soon. \n\n Best regards, \nJobScope`
    })
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Failed to send email: ${response.statusText}`);
    }
    const result = await response.text();
    console.log(`Email sent successfully: ${result}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};