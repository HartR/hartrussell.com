let particles = [];
let maxDistance = 120;
let particleCount = 70;
let mouseRepelDist = 150;
let mouseForce = 1.2;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-container');
  
  // Set HSB color mode for beautiful, intuitive color transitions
  colorMode(HSB, 360, 100, 100, 1.0);
  
  // Optimize particle count for mobile screens
  if (windowWidth < 768) {
    particleCount = 25;
    maxDistance = 80;
    mouseRepelDist = 100;
  }
  
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  // Clear canvas for transparent background, allowing CSS gradient to show through
  clear();
  
  // Draw and connect particles
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].display();
    
    for (let j = i + 1; j < particles.length; j++) {
      let d = dist(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
      if (d < maxDistance) {
        // Opacity drops off as particles drift apart
        let alpha = map(d, 0, maxDistance, 0.25, 0);
        
        // Pick a color intermediate between the two particles
        let avgHue = (particles[i].hue + particles[j].hue) / 2;
        stroke(avgHue, 70, 90, alpha);
        strokeWeight(1.2);
        line(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
      }
    }
  }
}

class Particle {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.vx = random(-0.3, 0.3);
    this.vy = random(-0.3, 0.3);
    this.size = random(2.5, 6.0);
    // Cyan to Violet hue range
    this.hue = random(180, 275);
    this.brightness = random(85, 100);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Bounce off edges with a slight margin
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
    
    // Repel from mouse cursor
    let d = dist(mouseX, mouseY, this.x, this.y);
    if (d < mouseRepelDist && mouseX > 0 && mouseY > 0 && mouseX < width && mouseY < height) {
      let forceX = this.x - mouseX;
      let forceY = this.y - mouseY;
      
      // Stronger push when closer
      let force = map(d, 0, mouseRepelDist, mouseForce, 0);
      
      // Avoid division by zero
      if (d > 0) {
        this.x += (forceX / d) * force * 2.0;
        this.y += (forceY / d) * force * 2.0;
      }
    }
  }

  display() {
    noStroke();
    
    // Enable glowing shadow effects on modern canvas renderer
    drawingContext.shadowBlur = 10;
    drawingContext.shadowColor = color(this.hue, 80, 100, 0.5).toString();
    
    fill(this.hue, 80, this.brightness, 0.7);
    ellipse(this.x, this.y, this.size);
    
    // Reset shadow blur to avoid performance degradation on other operations
    drawingContext.shadowBlur = 0;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  
  // Recalculate particle count
  let targetCount = windowWidth < 768 ? 25 : 70;
  if (particles.length !== targetCount) {
    particles = [];
    for (let i = 0; i < targetCount; i++) {
      particles.push(new Particle());
    }
  }
}
