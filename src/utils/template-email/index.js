function getWelcomeMessageTemplate(fullname){
    return `<!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <title>Welcome to Books19</title>
        <style>
            body {
            font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
            background-color: #f5f7fa;
            margin: 0;
            padding: 0;
            color: #333;
            }
            .container {
            width: 100%;
            max-width: 620px;
            margin: 40px auto;
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            }
            .header {
            padding: 5px;
            text-align: center;
            background:#f0ad4e;
            }
            .header img {
            width: 120px;
        
            }
            .header h1 {
            color: #fff;
            font-size: 26px;
            margin: 0;
            }
            .content {
            padding: 10px ;
            text-align:center;
            }
            .content h2 {
            font-size: 22px;
            margin-bottom: 10px;
            color: #222;
            }
            .content p {
            font-size: 16px;
            line-height: 1.7;
            margin-bottom: 20px;
            color: #555;
            }
            .button-container {
            text-align: center;
            margin: 30px 0;
            }
            .button {
            background: #222;
            color: #fff;
            text-decoration: none;
            padding: 14px 30px;
            font-size: 16px;
            border-radius: 8px;
            display: inline-block;
            font-weight: 600;
            transition: background 0.3s ease;
            }
            .button:hover {
            background: #3a78c2;
            }
            .footer {
            font-size: 13px;
            color: #aaa;
            text-align: center;
            padding: 20px;
            background: #f0f2f5;
            }
        </style>
        </head>
        <body>
        <div class="container">
            <div class="header">
            <img 
            src="https://books19-assets.onrender.com/images/books19.png" 
            alt="Books19 Logo"
            />
            <h1>Welcome to Books19</h1>
            </div>
            <div class="content">
            <h2>Hello ${fullname}!</h2>
            <p>
                Thank you for joining <strong>Books19</strong>, your modern online library! 📚✨<br>
                Dive into an endless collection of books, explore new genres, and enjoy reading like never before.
            </p>
            <p>
                We're thrilled to have you with us. Whether you're looking for inspiring novels, educational resources, or the latest bestsellers, Books19 has it all — just a few clicks away.
            </p>
            <div class="button-container">
                <a href="${process.env.BASE_URL}" class="button">Browse Library</a>
            </div>
            </div>
            <div class="footer">
            &copy; 2025 Books19. Crafted for book lovers.
            </div>
        </div>
        </body>
        </html>
        `
    }


function getErrorTemplateMessage(endpoint,name,message){
    return `<!DOCTYPE html>
            <html lang="fr">
            <head>
            <meta charset="UTF-8">
            <title>Erreur détectée - Books19 API</title>
            <style>
                body {
                font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
                background-color: #f4f6f8;
                margin: 0;
                padding: 0;
                color: #333;
                }
                .container {
                max-width: 600px;
                margin: 40px auto;
                background-color: #fff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 6px 20px rgba(0,0,0,0.1);
                }
                .header {
                background-color: #e74c3c;
                padding: 20px;
                text-align: center;
                color: white;
                }
                .header h1 {
                margin: 0;
                font-size: 24px;
                }
                .content {
                padding: 30px 20px;
                }
                .content h2 {
                color: #e74c3c;
                font-size: 20px;
                margin-bottom: 20px;
                }
                .content p {
                font-size: 16px;
                margin-bottom: 10px;
                line-height: 1.5;
                }
                .error-details {
                background-color: #fbeaea;
                border-left: 5px solid #e74c3c;
                padding: 15px;
                font-family: monospace;
                color: #c0392b;
                margin-bottom: 20px;
                white-space: pre-wrap;
                word-wrap: break-word;
                }
                .footer {
                text-align: center;
                padding: 20px;
                font-size: 13px;
                color: #aaa;
                background-color: #f0f2f5;
                }
            </style>
            </head>
            <body>
            <div class="container">
                <div class="header">
                <h1>⚠️ Erreur Critique Détectée</h1>
                </div>
                <div class="content">
                <h2>Une erreur est survenue sur l'API Books19</h2>
                <p><strong>Name :</strong> ${name}</p>
                <p><strong>Endpoint :</strong> ${endpoint}</p>

                <div class="error-details">
                    ${message}
                </div>

                <p>Veuillez examiner et corriger cette erreur dès que possible.</p>
                </div>
                <div class="footer">
                &copy; 2025 Books19 - Système d'alerte automatique
                </div>
            </div>
            </body>
            </html>
`
}

function getPasswordResetTemplate(resetLink){
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <title>Reset Your Password - Books19</title>
    <style>
        body {
        font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
        background-color: #f4f6f8;
        margin: 0;
        padding: 0;
        color: #333;
        }
        .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 6px 20px rgba(0,0,0,0.1);
        }
        .header {
        background-color: #4CAF50;
        text-align: center;
        padding: 30px;
        }
        .header img {
        max-width: 120px;
        margin-bottom: 10px;
        }
        .header h1 {
        color: #ffffff;
        font-size: 24px;
        margin: 0;
        }
        .content {
        padding: 30px;
        text-align: center;
        }
        .content p {
        font-size: 16px;
        line-height: 1.6;
        margin: 20px 0;
        }
        .button {
        display: inline-block;
        margin-top: 20px;
        padding: 12px 24px;
        background-color:  #f0ad4e;
        color: #ffffff;
        text-decoration: none;
        font-size: 16px;
        border-radius: 5px;
        }
        .footer {
        background-color: #f0f0f0;
        text-align: center;
        font-size: 14px;
        color: #999;
        padding: 20px;
        }
    </style>
    </head>
    <body>
    <div class="container">
        <div class="header">
         <img 
            src="https://books19-assets.onrender.com/images/books19.png" 
            alt="Books19 Logo"
        />
        <h1>Password Reset Request</h1>
        </div>
        <div class="content">
        <p>Hello,</p>
        <p>
            We received a request to reset your password for your Books19 account.
            Link expires in 10min.
            Click the button below to create a new password:
        </p>
        <a href="${resetLink}" class="button">Reset Password</a>
        <p>If you did not request a password reset, please ignore this email. Your account will remain secure.</p>
        </div>
        <div class="footer">
        &copy; 2025 Books19. All rights reserved.
        </div>
    </div>
    </body>
    </html>
`
};

module.exports = { 
    getWelcomeMessageTemplate,
    getErrorTemplateMessage,
    getPasswordResetTemplate
};
