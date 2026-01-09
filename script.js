document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.createElement('canvas');
    canvas.id = 'bg-canvas';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let width, height;

    const colors = ['#FFB6C1', '#FFF0F5', '#FF69B4', '#FFC0CB', '#FFFFFF'];
    const shapes = ['circle', 'square', 'triangle', 'cross', 'heart'];
    const particles = [];

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.init(true);
        }

        init(randomY = false) {
            // Spawn mostly from top and right
            if (randomY) {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
            } else {
                if (Math.random() > 0.5) {
                    // Spawn from top
                    this.x = Math.random() * (width + 100);
                    this.y = -50;
                } else {
                    // Spawn from right
                    this.x = width + 50;
                    this.y = Math.random() * (height + 100) - 100;
                }
            }

            this.size = Math.random() * 50 + 10; // 10px to 30px
            this.speed = Math.random() * 1 + 0.5;
            this.angle = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.05;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.shape = shapes[Math.floor(Math.random() * shapes.length)];
            this.opacity = Math.random() * 0.5 + 0.1;
        }

        update() {
            // Move Top-Right to Bottom-Left
            this.x -= this.speed;
            this.y += this.speed;
            this.angle += this.rotationSpeed;

            // Reset if out of bounds
            if (this.x < -100 || this.y > height + 100) {
                this.init();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 2;

            switch (this.shape) {
                case 'circle':
                    ctx.beginPath();
                    ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                case 'square':
                    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
                    break;
                case 'triangle':
                    ctx.beginPath();
                    ctx.moveTo(0, -this.size / 2);
                    ctx.lineTo(this.size / 2, this.size / 2);
                    ctx.lineTo(-this.size / 2, this.size / 2);
                    ctx.closePath();
                    ctx.fill();
                    break;
                case 'cross':
                    ctx.beginPath();
                    ctx.moveTo(-this.size / 2, 0);
                    ctx.lineTo(this.size / 2, 0);
                    ctx.moveTo(0, -this.size / 2);
                    ctx.lineTo(0, this.size / 2);
                    ctx.stroke();
                    break;
                case 'heart':
                    ctx.beginPath();
                    const s = this.size / 2; // scale helper
                    // Start at top center dip
                    ctx.moveTo(0, -s * 0.3);
                    // Top left curve
                    ctx.bezierCurveTo(-s * 0.5, -s * 1, -s, -s * 0.2, 0, s);
                    // Top right curve (mirrored from bottom point back to top)
                    // Actually let's draw two curves from top center

                    // Reset
                    ctx.moveTo(0, -s * 0.2);
                    ctx.bezierCurveTo(-s, -s, -s * 1.2, s * 0.5, 0, s);
                    ctx.bezierCurveTo(s * 1.2, s * 0.5, s, -s, 0, -s * 0.2);
                    ctx.fill();
                    break;
            }

            ctx.restore();
        }
    }

    const particleCount = 100;
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    animate();

    // Secret Sprout Interaction
    const sproutTrigger = document.getElementById('sprout-trigger');
    const secretOverlay = document.getElementById('secret-overlay');

    if (sproutTrigger && secretOverlay) {
        sproutTrigger.addEventListener('click', () => {
            secretOverlay.classList.add('active');
        });

        secretOverlay.addEventListener('click', () => {
            secretOverlay.classList.remove('active');
        });
    }

    // Gallery Interaction
    const videoTrigger = document.getElementById('video-trigger');
    const galleryOverlay = document.getElementById('gallery-overlay');

    if (videoTrigger && galleryOverlay) {
        videoTrigger.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent video controls interaction
            galleryOverlay.classList.add('active');
        });

        galleryOverlay.addEventListener('click', () => {
            galleryOverlay.classList.remove('active');
        });

        // Clone for infinite loop (3D Slideshow)
        const track = document.getElementById('gallery-track');
        if (track) {
            const items = Array.from(track.children);
            items.forEach(item => {
                const clone = item.cloneNode(true);
                track.appendChild(clone);
            });
        }
    }

    // Move Widget on Scroll
    const recommendWidget = document.querySelector('.recommend-widget');
    const widgetHeader = document.querySelector('.widget-header');

    if (recommendWidget && widgetHeader) {
        window.addEventListener('scroll', () => {
            // Check if near bottom (e.g., 50px from end)
            const scrollPosition = window.innerHeight + window.scrollY;
            const threshold = document.body.offsetHeight - 50;

            if (scrollPosition >= threshold) {
                if (!recommendWidget.classList.contains('move-up')) {
                    recommendWidget.classList.add('move-up');
                    widgetHeader.textContent = '👆 おすすめ！'; // Point up
                }
            } else {
                if (recommendWidget.classList.contains('move-up')) {
                    recommendWidget.classList.remove('move-up');
                    widgetHeader.textContent = '👇 おすすめ！'; // Point down
                }
            }
        });
    }
});
