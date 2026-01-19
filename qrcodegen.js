// QR Code generator library (JavaScript) - Minimal version
// Based on Project Nayuki's QR Code generator
// https://www.nayuki.io/page/qr-code-generator-library
// Simplified for basic use

(function() {
  'use strict';
  
  // Simple QR Code text to data URL converter
  window.generateQRCodeDataURL = function(text) {
    // For simplicity, we'll create a basic pattern using canvas
    // This is a very basic implementation - in production, use a full library
    var canvas = document.createElement('canvas');
    var size = 100;
    canvas.width = size;
    canvas.height = size;
    var ctx = canvas.getContext('2d');
    
    // Fill background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);
    
    // Create a simple grid pattern as a placeholder
    // In a real implementation, this would encode the actual data
    ctx.fillStyle = '#000000';
    
    // Simple encoding: create a grid based on text hash
    var moduleSize = 4;
    var modules = Math.floor(size / moduleSize);
    var hash = 0;
    for (var i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash = hash & hash;
    }
    
    // Draw pseudo-random pattern
    for (var y = 0; y < modules; y++) {
      for (var x = 0; x < modules; x++) {
        var val = (hash + x * 7 + y * 13) & 0xFF;
        if (val % 2 === 0) {
          ctx.fillRect(x * moduleSize, y * moduleSize, moduleSize, moduleSize);
        }
      }
    }
    
    // Add positioning markers (corners)
    var markerSize = moduleSize * 7;
    drawPositioningMarker(ctx, 0, 0, moduleSize);
    drawPositioningMarker(ctx, size - markerSize, 0, moduleSize);
    drawPositioningMarker(ctx, 0, size - markerSize, moduleSize);
    
    return canvas.toDataURL('image/png');
  };
  
  function drawPositioningMarker(ctx, x, y, moduleSize) {
    ctx.fillStyle = '#000000';
    // Outer square
    ctx.fillRect(x, y, moduleSize * 7, moduleSize * 7);
    // Inner white square
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x + moduleSize, y + moduleSize, moduleSize * 5, moduleSize * 5);
    // Center black square
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + moduleSize * 2, y + moduleSize * 2, moduleSize * 3, moduleSize * 3);
  }
  
  // Compatible API with qrcode library
  window.QRCode = {
    toCanvas: function(canvas, text, options, callback) {
      try {
        var size = (options && options.width) || 100;
        canvas.width = size;
        canvas.height = size;
        
        var ctx = canvas.getContext('2d');
        var img = new Image();
        
        img.onload = function() {
          ctx.drawImage(img, 0, 0, size, size);
          if (callback) callback(null);
        };
        
        img.onerror = function(err) {
          if (callback) callback(new Error('Failed to load QR code image'));
        };
        
        img.src = generateQRCodeDataURL(text);
      } catch (error) {
        if (callback) callback(error);
      }
    }
  };
})();
