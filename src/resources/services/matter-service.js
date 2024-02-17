import { inject } from 'aurelia-framework';
import {
    EventAggregator
} from 'aurelia-event-aggregator';
import Matter from 'matter-js';

@inject(Matter)
export class MatterService {
    constructor(matter) {
        this._matter = matter;
        this.Engine = matter.Engine;
        this.Render = matter.Render;
        this.World = matter.World;
        this.Bodies = matter.Bodies;
        this.Body = matter.Body;
        this.Events = matter.Events;
        this.Mouse = matter.Mouse;
    }

    setWorld($world) {

        this._engine = this.Engine.create();
        this._engine.world.gravity.y = 0;

        const renderOptions = {
            width: $world.width(),
            height: $world.height(),
            wireframes: false // om vulkleur te kunnen gebruiken
        };

        $world = $world || $('body');
        this._container = $world[0];
        this._render = this.Render.create({
            element: this._container,
            engine: this._engine,
            options: renderOptions
        });
        this._canvas = $('canvas')[0];
    }

    useMouse() {
        const mouseConstraint = this._matter.MouseConstraint.create(
            this._engine, { // Create Constraint
            constraint: {
                render: {
                    visible: false
                },
                stiffness: 0.8
            }
        });
        this._matter.World.add(this._engine.world, mouseConstraint);
        mouseConstraint.mouse.element.removeEventListener("mousewheel", mouseConstraint.mouse.mousewheel);
        mouseConstraint.mouse.element.removeEventListener("DOMMouseScroll", mouseConstraint.mouse.mousewheel);
    }

    alignCanvas() {
        this._canvas.width = this._container.offsetWidth;
        this._canvas.height = this._container.offsetHeight;
    }

    clearArena() {
        this.World.clear(this.World);
        this.Engine.clear(this._engine);
    }

    startEngine() {
        this.Engine.run(this._engine);
        this.Render.run(this._render);
    }

    moveBalls(x, y) {
        // Assuming you have a reference to the world or composite where the circles are located
        this._matter.Composite.allBodies(this._engine.world).forEach(body => {
            if (body.circleRadius) {
                const speedX = 10;
                const speedY = 10;
                // This body is a circle, you can perform operations on it here
                this.Body.setVelocity(body, { x: speedX, y: speedY });
                this.Body.setAngle(body, 0); // radians
            }
        });
    }

    setPucks(pucks) {
        pucks.forEach(puck => {
            this._puck = this.Bodies.circle(...puck, {
                render: {
                    fillStyle: 'goldenrod',
                    lineWidth: 0
                }
            });
            this.World.add(this._engine.world, this._puck);
        });
    }

    setWalls(walls) {
        walls.forEach(wall => {
            const thisWall = this.Bodies.rectangle(...wall, {
                isStatic: true,
                render: {
                    fillStyle: 'lightskyblue',
                    lineWidth: 0
                }
            });
            this.World.add(this._engine.world, thisWall);
        });
    }
}
