const fs = require('fs');
const path = require('path');
const {performance} = require('perf_hooks');

// 1. Setup: Create a large dummy file (approx 200 MB)
const FILE_NAME = 'huge_test_file.txt';
const FILE_SIZE_BYTES = 200 * 1024 * 1024; // 200MB

function createDummyFile() {
    if (fs.existsSync(FILE_NAME)) return; // Skip if exists
    console.log('⏳ Generating 200MB test file... (This happens once)');
    const file = fs.openSync(FILE_NAME, 'w');
    // Write 200MB of empty spaces
    const buffer = Buffer.alloc(1024 * 1024, ' '); // 1MB chunk
    for (let i = 0; i < 20; i++) {
        fs.writeSync(file, buffer);
    }
    fs.closeSync(file);
    console.log('✅ File created.\n');
}

// Helper to check memory usage
function getMemoryUsage() {
    const used = process.memoryUsage().rss / 1024 / 1024;
    return `${Math.round(used)} MB`;
}

// TEST 1: BUFFERING (fs.readFile)
function testBuffering() {
    console.log('--- TEST 1: BUFFERING (fs.readFile) ---');
    console.log(`Initial Memory: ${getMemoryUsage()}`);
    
    const start = performance.now();

    fs.readFile(FILE_NAME, (err, data) => {
        const end = performance.now();
        console.log(`\n🔴 RESULT: Buffering Complete`);
        console.log(`Time waited before I could touch data: ${(end - start).toFixed(2)} ms`);
        console.log(`Memory Spike: ${getMemoryUsage()}`);
        console.log(`Data Size in RAM: ${data.length / 1024 / 1024} MB`);
        
        // Clear memory for next test
        global.gc && global.gc(); 
        setTimeout(testStreaming, 5000); // Start next test after 2s
    });
}

// TEST 2: STREAMING (fs.createReadStream)
function testStreaming() {
    console.log('\n\n--- TEST 2: STREAMING (fs.createReadStream) ---');
    console.log(`Initial Memory: ${getMemoryUsage()}`);

    const start = performance.now();
    const stream = fs.createReadStream(FILE_NAME); // HighWaterMark defaults to 64KB

    let firstChunkReceived = false;

    stream.on('data', (chunk) => {
        // This runs EVERY time we get a small piece (chunk)
        if (!firstChunkReceived) {
            const timeToFirstByte = performance.now() - start;
            console.log(`\n🟢 RESULT: First Chunk Received!`);
            console.log(`Time waited before I could touch data: ${timeToFirstByte.toFixed(2)} ms`);
            console.log(`Memory Usage NOW: ${getMemoryUsage()}`);
            firstChunkReceived = true;
        }
    });

    stream.on('end', () => {
        const totalTime = performance.now() - start;
        console.log(`\nStream Finished Reading.`);
        console.log(`Total Time: ${totalTime.toFixed(2)} ms`);
        console.log(`Final Memory Usage: ${getMemoryUsage()}`);
        
        // Cleanup
        fs.unlinkSync(FILE_NAME);
    });
}

// --- RUN THE EXPERIMENT ---
createDummyFile();
testBuffering();