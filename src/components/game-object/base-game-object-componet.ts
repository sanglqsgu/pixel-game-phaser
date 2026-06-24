import * as Phaser from 'phaser';
import { GameObject } from '../../common/types';

/**
 * Base class cho tất cả component
 */
export class BaseGameObjectComponent {
    protected scene: Phaser.Scene;

    protected gameObject: GameObject;

    constructor(gameObject: GameObject) {
        this.scene = gameObject.scene;
        this.gameObject = gameObject;

        this.assignComponentToObject(gameObject);
    }

    /**
     * Lấy component từ GameObject
     */
    static getComponent<T>(gameObject: GameObject): T {
        return (gameObject as any)[`_${this.name}`] as T;
    }

    /**
     * Xóa component khỏi GameObject
     */
    static removeComponent(gameObject: GameObject): void {
        delete (gameObject as any)[`_${this.name}`];
    }

    /**
     * Gắn component vào object
     */
    protected assignComponentToObject(object: GameObject): void {
        (object as any)[`_${this.constructor.name}`] = this;
    }
}