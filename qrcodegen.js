/*
 * QR Code generator - Simplified Implementation
 * 
 * NOTE: This is a simplified visual QR code generator that creates QR-like patterns.
 * For production use with actual QR code scanning functionality, please replace this
 * with a full QR code library such as:
 * - qrcode.js (https://github.com/davidshimjs/qrcodejs)
 * - node-qrcode (https://github.com/soldair/node-qrcode)
 * - qr-code-generator by Nayuki (https://www.nayuki.io/page/qr-code-generator-library)
 * 
 * This implementation provides visual QR code patterns for layout purposes.
 */

(function() {
  'use strict';
  
  // Simplified QR Code generator
  // Creates visual QR code patterns based on input text
  // NOTE: These patterns are for visual representation and may not be scannable
  // Replace with a full QR implementation for production scanning needs
  
  function generateQRCode(text) {
    // Create a simple data matrix encoding
    // This is a minimal QR code implementation
    var qr = {
      version: 1,
      size: 21, // Version 1 = 21x21 modules
      modules: []
    };
    
    // Initialize modules
    for (var i = 0; i < qr.size; i++) {
      qr.modules[i] = [];
      for (var j = 0; j < qr.size; j++) {
        qr.modules[i][j] = false;
      }
    }
    
    // Add finder patterns (corners)
    addFinderPattern(qr.modules, 0, 0);
    addFinderPattern(qr.modules, qr.size - 7, 0);
    addFinderPattern(qr.modules, 0, qr.size - 7);
    
    // Add timing patterns
    for (var i = 8; i < qr.size - 8; i++) {
      qr.modules[6][i] = (i % 2 === 0);
      qr.modules[i][6] = (i % 2 === 0);
    }
    
    // Add dark module
    qr.modules[4 * qr.version + 9][8] = true;
    
    // Encode data (simplified - creates a pattern based on text)
    encodeData(qr.modules, text, qr.size);
    
    return qr;
  }
  
  function addFinderPattern(modules, row, col) {
    for (var r = -1; r <= 7; r++) {
      for (var c = -1; c <= 7; c++) {
        var rr = row + r;
        var cc = col + c;
        if (rr >= 0 && rr < modules.length && cc >= 0 && cc < modules.length) {
          modules[rr][cc] = (
            (r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
            (c >= 0 && c <= 6 && (r === 0 || r === 6)) ||
            (r >= 2 && r <= 4 && c >= 2 && c <= 4)
          );
        }
      }
    }
  }
  
  function encodeData(modules, text, size) {
    // Simple encoding based on text content
    // This creates a deterministic pattern
    var hash = 0;
    for (var i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash = hash | 0; // Convert to 32-bit integer
    }
    
    // Fill remaining modules with pattern
    for (var row = 0; row < size; row++) {
      for (var col = 0; col < size; col++) {
        // Skip if already set (finder patterns, timing, etc.)
        if (row < 9 && col < 9) continue;
        if (row < 9 && col >= size - 8) continue;
        if (row >= size - 8 && col < 9) continue;
        if (row === 6 || col === 6) continue;
        
        // Create pattern based on hash and position
        var val = hash + row * 7 + col * 13;
        modules[row][col] = ((val & 0xFF) % 2 === 0);
      }
    }
  }
  
  function renderQRCode(qr, canvas, size) {
    var ctx = canvas.getContext('2d');
    canvas.width = size;
    canvas.height = size;
    
    var scale = size / qr.size;
    
    // White background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);
    
    // Black modules
    ctx.fillStyle = '#000000';
    for (var row = 0; row < qr.size; row++) {
      for (var col = 0; col < qr.size; col++) {
        if (qr.modules[row][col]) {
          ctx.fillRect(col * scale, row * scale, scale, scale);
        }
      }
    }
  }
  
  // Public API compatible with qrcode library
  window.QRCode = {
    toCanvas: function(canvas, text, options, callback) {
      try {
        var size = (options && options.width) || 100;
        var qr = generateQRCode(text);
        renderQRCode(qr, canvas, size);
        
        if (callback) {
          setTimeout(function() {
            callback(null);
          }, 0);
        }
      } catch (error) {
        if (callback) {
          callback(error);
        }
      }
    }
  };
})();
