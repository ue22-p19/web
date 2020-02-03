const svgNS = "http://www.w3.org/2000/svg";


class SpinningWheel {

    constructor(svg, 
                cx, cy, cr, 
                dots, dot_r,
                period, 
                rgb_light, rgb_dark) {
        this.svg = svg;
        this.cx = cx;
        this.cy = cy;
        this.cr = cr;
        this.dots = dots;
        this.dot_r = dot_r;
        // duration between 2 dots
        this._period = period/dots;
        [this.redl, this.greenl, this.bluel] = rgb_light;
        [this.redd, this.greend, this.blued] = rgb_dark;
        //
        this._offset = 0;
        this._theta = 2 * Math.PI / this.dots;
        this.active = true;
    }

    _alpha(n) {
        return - n * this._theta - Math.PI/2;
    }

    _x_y (n) {
        let alpha = this._alpha(n);
        return [
            this.cx + this.cr * Math.cos(alpha),
            this.cy + this.cr * Math.sin(alpha),
        ]
    }
    _color(n) {
        // stay in range
        n = n % this.dots;
        // grayscale for starters
        let ratio = (n/this.dots);
        return `rgb(
            ${this.redd + ratio*(this.redl-this.redd)},
            ${this.greend + ratio*(this.greenl-this.greend)},
            ${this.blued + ratio*(this.bluel-this.blued)})`;
        }

    _init() {
        for (let index=0; index < this.dots; index ++) {
            let dot = document.createElementNS(svgNS, 'circle');
            let [x, y] = this._x_y(index);
            dot.setAttribute('cx', x);
            dot.setAttribute('cy', y);
            dot.setAttribute('r', this.dot_r);
            dot.style.fill = this._color(index);
            this.svg.append(dot);
        }
    }
    _paint() {
        // would be cool to have range and zip
        let index = 0;
        for (let circle of this.svg.children) {
            circle.style.fill = this._color(this._offset + index);
            index += 1;
        }
    }

    next() {
        this._offset += 1;
        this._paint();
        if (this.active)
            setTimeout( () => this.next(), this._period);
    }

    start() {
        this._init();
        this.next();
    }
    stop() {
        this.active = false;
    }
    resume() {
        this.active = true;
    }
}

function create_spinning_wheel(element_id) {
    let container = document.getElementById(element_id);
    let svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', 200);
    svg.setAttribute('height', 200);
    container.append(svg);
    let spin = new SpinningWheel(
        svg, 100, 100, 80, 
        12, 18, 
        700, 
        [100, 240, 145], [80, 60, 120]);
    spin.start();
    return spin;
}