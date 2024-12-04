const http = require("http");
const nodemailer = require("nodemailer");
require("dotenv").config(); // Load environment variables
const readline = require("readline"); // For reading input from the console

// Function to generate a random code
function generateRandomCode(length = 6) {
    const characters = "0123456789";
    let code = "";
    for (let i = 0; i < length; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}

// Setup readline interface to get input from the console
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Prompt the user for the client email
rl.question("Enter the client's email address: ", (clientEmail) => {
    if (!clientEmail) {
        console.log("Error: No email address provided.");
        rl.close();
        return;
    }

    // Generate a random code
    const randomCode = generateRandomCode();

    // Create a transporter for sending the email
    const transporter = nodemailer.createTransport({
        service: "gmail",
        secure: true,
        port: 465,
        auth: {
            user: process.env.EMAIL_USER, // Your email
            pass: process.env.EMAIL_PASS, // Your app password
        },
    });

    // Email options with the random code inserted in the body
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: clientEmail, // Send the email to the client
        subject: "Your Verification Code",
        text: `Hello! Your verification code is: ${randomCode}`, // Plain text version
        html: `<p>Hello! Your verification code is: <strong>${randomCode}</strong></p>`, // HTML version
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error occurred:", error.message);
            rl.close();
            return;
        } else {
            console.log("Email sent successfully to", clientEmail);
            console.log("Verification Code:", randomCode);
        }
        rl.close();
    });
});

// Create and start the server
const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Server running. Check the console for email input.\n");
});

server.listen(8080, () => {
    console.log("Server running at http://localhost:8080");
});
