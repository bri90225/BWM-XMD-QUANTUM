// index.js

// [BWM-XMD QUANTUM EDITION]
// >> A superposition of elegant code states
// >> Collapsed into optimal execution
// >> Scripted by Sir Ibrahim Adams
// >> Version: 8.3.5-quantum.7

// Core Baileys dependencies
const { makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const qrcode = require('qrcode-terminal');
require('dotenv').config(); // For loading environment variables like API keys

// IMPORTANT: ALL YOUR BOT'S MAIN LOGIC SHOULD GO HERE.
// This includes your actual message handling, command processing,
// and integrations with libraries like axios, cheerio (if used for non-loader purposes),
// gemini-ai, etc.

// Example structure for your main bot logic:
async function startBwmxmdBot() {
    // State will save your session info (login details)
    const { state, saveCreds } = await useMultiFileAuthState('baileys_auth_info');

    const sock = makeWASocket({
        logger: pino({ level: 'silent' }), // Suppress detailed Baileys internal logs
        // Removed: printQRInTerminal: true, as it's deprecated and handled manually below
        browser: ['Bwmxmd Quantum', 'Safari', '1.0'], // Custom client name for WhatsApp Web
        auth: state,
    });

    // Event listener for connection updates
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            // This is where you manually handle the QR code, which is the correct way now.
            qrcode.generate(qr, { small: true });
            console.log('⚡️ Bwmxmd Bot: Scan this QR code with your WhatsApp app (Linked Devices).');
        }

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Bwmxmd Bot connection closed due to ', lastDisconnect.error, ', reconnecting: ', shouldReconnect);
            if (shouldReconnect) {
                startBwmxmdBot(); // Attempt to reconnect
            } else {
                console.log('Bwmxmd Bot logged out. To reconnect, delete the "baileys_auth_info" folder and restart.');
            }
        } else if (connection === 'open') {
            console.log('🎉 Bwmxmd Bot connection opened! Ready to serve!');
        }
    });

    // Event listener for credentials updates (saves your session data)
    sock.ev.on('creds.update', saveCreds);

    // Event listener for incoming messages
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        // --- START DEBUG LOGS ---
        console.log('--- MESSAGES UPSERT EVENT FIRED ---');
        console.log('Event Type:', type);
        // --- END DEBUG LOGS ---

        if (type === 'notify') {
            for (let msg of messages) {
                // --- START DEBUG LOGS ---
                console.log('\n--- Processing a new message ---');
                console.log('Full Message Object (stringified):', JSON.stringify(msg, null, 2));
                console.log('Message Key (fromMe):', msg.key.fromMe);
                console.log('Message Content exists:', !!msg.message);
                // --- END DEBUG LOGS ---

                if (!msg.key.fromMe && msg.message) {
                    const sender = msg.key.remoteJid;
                    const text = (msg.message.conversation || msg.message.extendedTextMessage?.text || '').trim(); // Added .trim() for robustness

                    // --- START DEBUG LOGS ---
                    console.log(`\n--- Message Processed ---`);
                    console.log(`Sender ID: ${sender}`);
                    console.log(`Extracted Text: "${text}"`);
                    // --- END DEBUG LOGS ---

                    // *******************************************************************
                    // >>> PASTE YOUR ACTUAL BOT COMMANDS AND LOGIC HERE <<<
                    // This is where all the Baileys message handling logic that was in your
                    // remote script needs to go.
                    // *******************************************************************

                    // Example commands (replace with your actual commands):
                    if (text.toLowerCase() === '!hello') {
                        console.log('DEBUG: Matched "!hello" command.');
                        try {
                            await sock.sendMessage(sender, { text: '👋 Hello from Bwmxmd Quantum Edition!' });
                            console.log('DEBUG: Sent response for "!hello".');
                        } catch (e) {
                            console.error('ERROR sending !hello response:', e);
                        }
                    } else if (text.toLowerCase() === '!ping') {
                        console.log('DEBUG: Matched "!ping" command.');
                        try {
                            await sock.sendMessage(sender, { text: '🏓 Pong!' });
                            console.log('DEBUG: Sent response for "!ping".');
                        } catch (e) {
                            console.error('ERROR sending !ping response:', e);
                        }
                    } else if (text.toLowerCase().startsWith('!echo ')) {
                        const echoText = text.substring('!echo '.length);
                        console.log(`DEBUG: Matched "!echo" command with text: "${echoText}"`);
                        try {
                            await sock.sendMessage(sender, { text: `Echoing: ${echoText}` });
                            console.log('DEBUG: Sent response for "!echo".');
                        } catch (e) {
                            console.error('ERROR sending !echo response:', e);
                        }
                    }
                    else {
                        console.log(`DEBUG: No command matched for text: "${text}"`);
                    }

                } else {
                    console.log('DEBUG: Message ignored (either from bot itself or no discernible text content).');
                }
            }
        }
    });
}

// Start the bot when the script runs
startBwmxmdBot();
