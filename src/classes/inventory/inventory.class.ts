import type { Camera } from '@camera/camera.class';
import { Sprite } from '@sprite/sprite.class';
import { KEYBOARD_CONFIG } from '@config/keyboard';
import { Cursor } from '@cursor/cursor.class';
import { Rectangle } from '@math/rectangle';

import inventory from '@sprites/inventory.png';
import selected from '@sprites/selected-slot.png';

const SLOT_SIZE = 32;
const INVENTORY_SPRITE_MARGINS = {
    craft: 76,
    x: 9,
    y: 9,
    extra: 5,
    outline: 1,
};

type Coords = {
    x: number;
    y: number;
};

export class Inventory {
    private static _instance?: Inventory;

    private _imageWidth = 314;
    private _imageHeight = 323;

    private readonly _cursor = new Cursor();
    private readonly _slots = { width: 9, height: 4, data: new Int16Array({ length: 36 }).fill(0) };
    private readonly _craft = { width: 2, height: 2, data: new Int16Array({ length: 5 }).fill(0) };

    private readonly _inventory = new Sprite({ src: inventory, x: 0, y: 0 });
    private readonly _selected = new Sprite({ src: selected, x: 0, y: 0 });

    private _isOpened: boolean;

    constructor() {
        if (Inventory._instance) {
            return Inventory._instance;
        }

        Inventory._instance = this;

        this._listenForKeyboard();
    }

    data() {
        return this._slots.data;
    }

    draw(ctx: CanvasRenderingContext2D, camera: Camera) {
        if (!this._isOpened) {
            return;
        }

        const halfOnImageWidth = this._imageWidth / 2;
        const halfOfImageHeight = this._imageHeight / 2;

        const x = camera.w / 2 - halfOnImageWidth;
        const y = camera.h / 2 - halfOfImageHeight;

        ctx.save();
        this._inventory.draw(ctx, 0, x, y);
        void this._listenForSlotsIntersected(ctx, x, y + this._imageHeight - SLOT_SIZE);
        ctx.restore();
    }

    private async _listenForSlotsIntersected(ctx: CanvasRenderingContext2D, startX: number, startY: number) {
        const coords = this._cursor.coords;

        this._isIntersectedDefaultSlots(ctx, startX, startY, coords);
        this._isIntersectedCraftingSlots(ctx, startX, startY, coords);
    }

    private _isIntersectedCraftingSlots(ctx: CanvasRenderingContext2D, startX: number, startY: number, coords: Coords) {
        const outlined = SLOT_SIZE + INVENTORY_SPRITE_MARGINS.outline;

        const x = startX + this._imageWidth - outlined * 3 - SLOT_SIZE / 2;
        const y = startY - this._imageHeight + INVENTORY_SPRITE_MARGINS.craft + outlined;

        for (let h = 0; h < this._craft.height; h++) {
            for (let w = 0; w < this._craft.width; w++) {
                const cy = y + outlined * h;
                const cx = x + outlined * w;

                const rectangle = new Rectangle(cx, cy, SLOT_SIZE, SLOT_SIZE);

                if (rectangle.pointInRectangle(coords.x, coords.y)) {
                    this._selected.draw(ctx, 0, cx, cy);
                }
            }
        }

        const cx = x + outlined * this._craft.width + 7;
        const cy = y + outlined * this._craft.height - (SLOT_SIZE + SLOT_SIZE / 2);

        const rectangle = new Rectangle(cx, cy, SLOT_SIZE, SLOT_SIZE);
        if (rectangle.pointInRectangle(coords.x, coords.y)) {
            this._selected.draw(ctx, 0, cx, cy);
        }
    }

    private _isIntersectedDefaultSlots(ctx: CanvasRenderingContext2D, startX: number, startY: number, coords: Coords) {
        for (let h = 0; h < this._slots.height; h++) {
            for (let w = 0; w < this._slots.width; w++) {
                const outlined = SLOT_SIZE + INVENTORY_SPRITE_MARGINS.outline;

                const additionalOffset =
                    h === 0 ? 0 : INVENTORY_SPRITE_MARGINS.extra + outlined * this._slots.height - h * outlined;

                const x = startX + INVENTORY_SPRITE_MARGINS.x + w * outlined;
                const y = startY - INVENTORY_SPRITE_MARGINS.y - additionalOffset;

                const rectangle = new Rectangle(x, y, SLOT_SIZE, SLOT_SIZE);
                if (rectangle.pointInRectangle(coords.x, coords.y)) {
                    this._selected.draw(ctx, 0, x, y);
                }
            }
        }
    }

    private _listenForKeyboard() {
        window.addEventListener(
            'keypress',
            (event: KeyboardEvent) => {
                if (event.key === KEYBOARD_CONFIG.inv) {
                    this._isOpened = !this._isOpened;
                }
            },
            false
        );
    }
}
