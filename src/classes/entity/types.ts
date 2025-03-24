import type { Camera } from '@camera/camera';
import type { SpriteBorders, SpriteCrop } from '@sprite/types';
import type { Coords } from '@global-types';

export type EntityMisc = {
    speed: number;
    gravity: number;
};

export type EntitySprite = {
    src: string;
    crop: SpriteCrop;
};

export type EntityInstance = {
    coords: Coords;
    borders: SpriteBorders;
    sprite: EntitySprite;
    misc: EntityMisc;
};

export interface EntityLifeCycle {
    update(): void;
    collision(): Promise<void>;
    draw(ctx: CanvasRenderingContext2D, camera: Camera): void;
}
