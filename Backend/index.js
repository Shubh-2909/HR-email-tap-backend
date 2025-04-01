const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// HTML escaping function
function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Email template function
function createEmailBody(name, companyName) {
  return `
    <html>
    <head></head>
    <body>
    <p style="white-space: pre-line;">Dear ${escapeHtml(name)},</p>

    <p>Greetings from the <strong>Indian Institute of Information Technology, Ranchi!</strong></p>

    <p>We are delighted to invite your esteemed organization <strong>${escapeHtml(
      companyName
    )}</strong> to participate in the <strong>Placement/Internship drive</strong> of the Institute for the academic session <strong>2024-2025</strong>.</p>

    <p>Established in <strong>2016</strong>, <strong>IIIT Ranchi</strong> is a premier institute of national importance, created as part of a visionary initiative by the <strong>Ministry of Education, Government of India</strong>. With a focus on bridging academia and industry, <strong>IIIT Ranchi</strong> has rapidly become a hub of innovation, excellence, and future-ready talent, shaping the next generation of engineers and technologists.</p>

    <p><strong>Student Availability:</strong></p>
    <ul>
    <li><strong>Full-Time Employment (FTE):</strong> Starting <strong>June 2025</strong></li>
    <li><strong>6-Month Internships:</strong> Starting <strong>January 2025</strong> (graduating in <strong>2025</strong>)</li>
    <li><strong>Summer Internships:</strong> <strong>May to July 2025</strong> (graduating in <strong>2026</strong>)</li>
    </ul>

    <p><strong>Batch Demographics:</strong></p>
    <ul>
    <li><strong>B.Tech. CSE:</strong> <strong>112 students</strong></li>
    <li><strong>B.Tech. ECE:</strong> <strong>76 students</strong></li>
    <li><strong>B.Tech. CSE (DS&AI):</strong> <strong>27 students</strong></li>
    <li><strong>B.Tech. ECE (ES&IoT):</strong> <strong>28 students</strong></li>
    </ul>

    <p><strong>Track Record:</strong><br>We take immense pride in our students’ achievements, including:</p>
    <ul>
    <li>Securing positions in top-tier companies like <strong>Google, Amazon, Atlassian, Adobe, Walmart, NVIDIA, Flipkart, Cisco, NASDAQ, MPL, AngleOne, OnePlus, Intuit, Productiv, Zeotap, Commvault, American Express, VMware, Tekion Corp, Infoedge, Rakuten</strong>, and more.</li>
    <li>Excelling in prestigious global programs like <strong>Google Summer of Code (GSoC)</strong> and representing the institute as <strong>ICPC regionalists</strong>, with three teams making it to the regional in recent years.</li>
    <li>Demonstrating exceptional skills in competitive programming, with numerous students earning <strong>Specialist, Expert, and Candidate Master</strong> rankings on <strong>Codeforces</strong>, and <strong>6-star, 5-star, and 4-star</strong> rankings on <strong>CodeChef</strong>.</li>
    </ul>

    <p>To facilitate your participation, we kindly request you to complete the attached <strong><a href="https://docs.google.com/forms/d/e/1FAIpQLSc_6Lg_4bHE6tBhpR0Z16D4npfZqu_VT18dGfME9t0RtHkHmA/viewform">Job Notification Form</a></strong> with your requirements and offerings. The <strong>Training and Placement Cell</strong> will schedule the placement process as per the criteria outlined in our <strong>Placement Policy</strong>.</p>

    <p>For more information about our programs, achievements, and policies, please refer to the attached <strong>Placement Brochure</strong>.</p>

    <p><strong>Placement Brochure:</strong> <a href="https://drive.google.com/file/d/1HeDpDM6t7HhtUdp_VbLnostf-JB9S5-U/view">View Brochure</a><br>

    <p>If you need any assistance or information, please reach out to our student coordinators. We'd be more than happy to assist.</p>

    <p><strong>Akshat Kumar</strong> - +91 8498972554<br>
    <strong>Shubh Shubhanjal</strong> - +91 9508112887</p>

    <div style="font-family: Arial, sans-serif; max-width: 500px; color: #333333;">
  <p style="margin-bottom: 15px; font-weight: bold;">Thanks & regards,</p>
  
  <div style="display: flex; align-items: flex-start;">
    <div style="margin-right: 15px;">
      <img src="https://res.cloudinary.com/shubh39/image/upload/v1741670080/ewbfrw8yxdbfzhgdegvn.png" alt="IIIT Ranchi Logo" style="width: 80px; height: 80px;" />
    </div>
    
    <div>
      <p style="margin: 0; font-weight: bold; color: #1a5276; font-size: 16px;">Sonali Malviya</p>
      <p style="margin: 0; font-size: 14px; color: #1a5276;">Placement cum Public Relation Officer,</p>
      <p style="margin: 0; font-size: 14px; color: #1a5276;">Training and Placement Cell,</p>
      <p style="margin: 0; font-size: 14px; color: #1a5276;">Indian Institute of Information Technology, Ranchi</p>
      <p style="margin: 2px 0; font-style: italic; font-size: 12px; color: #555;">(An institute of national importance under MoE, Govt. of India)</p>
      
      <div style="margin-top: 8px; font-size: 13px;">
        <p style="margin: 0;">Mobile: +91-9936367853</p>
        <p style="margin: 0;">Email: <a href="mailto:tpo@iiitranchi.ac.in" style="color: #1a5276; text-decoration: none;">tpo@iiitranchi.ac.in</a></p>
        <p style="margin: 0;"><a href="http://www.iiitranchi.ac.in" style="color: #1a5276; text-decoration: none;">www.iiitranchi.ac.in</a></p>
      </div>
    </div>
  </div>
</div>
    `;
}

// Email sending API endpoint
app.post("/send-placement-email", async (req, res) => {
  const { email, companyName, name } = req.body;

  // Validate input
  if (!email || !companyName || !name) {
    return res.status(400).json({
      error:
        "Missing required fields: email, companyName, and name are required",
    });
  }

  try {
    const mailOptions = {
      from: `"IIIT Ranchi - Placement" <${process.env.EMAIL_ADDRESS}>`,
      to: email,
      subject:
        "Invitation to Participate in IIIT Ranchi's 2024-25 Campus Placement Drive",
      html: createEmailBody(name, companyName),
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Email sent successfully",
      recipient: { email, companyName, name },
    });
  } catch (error) {
    console.error("Email sending failed:", error);
    res.status(500).json({
      error: "Failed to send email",
      details: error.message,
    });
  }
});

app.get("/", (req, res) => {
  res.send("Welcome to the IIIT Ranchi Placement Email API!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong",
    details: err.message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
