const emailVerification = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      padding: 20px 0;
      background-color: #4CAF50; /* Main Green */
      color: white;
      border-radius: 8px 8px 0 0;
    }
    .content {
      padding: 20px;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      margin-top: 20px;
      background-color: #4CAF50; /* Main Green */
      color: white;
      text-decoration: none;
      border-radius: 5px;
    }
    .footer {
      text-align: center;
      padding: 10px 0;
      font-size: 12px;
      color: #777;
    }
    .divider {
      border-top: 1px solid #e0e0e0;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to Groucery</h1>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>Thank you for signing up at Groucery! To verify your email address, please click the button below:</p>
      <a href="{{verification_link}}" class="button">Verify Email</a>
      <p class="divider"></p>
      <p>If you did not sign up for this account, please ignore this email.</p>
    </div>
    <div class="footer">
      <p>&copy; 2024 Groucery. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;

export default emailVerification;
