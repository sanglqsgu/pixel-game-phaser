# Kiến trúc Template RPG Phaser 3

## Tổng quan

Template được xây dựng bằng Phaser 3, TypeScript và Vite nhằm cung cấp bộ khung ban đầu cho việc phát triển game RPG 2D theo phong cách Zelda-like. Hệ thống đã được chuẩn bị sẵn cơ chế quản lý Scene, Asset, Tilemap, Animation và UI cơ bản.

---

# Cấu trúc thư mục

## src/

Chứa toàn bộ source code của game.

### main.ts

Điểm khởi động của ứng dụng.

Nhiệm vụ:

* Khởi tạo Phaser Game.
* Đăng ký các Scene.
* Thiết lập cấu hình game.
* Chạy Scene đầu tiên khi game được mở.

---

## src/scenes/

Quản lý toàn bộ màn hình trong game.

### scene-keys.ts

Khai báo các hằng số tên Scene nhằm tránh hardcode string trong toàn bộ project.

Ví dụ:

* PRELOAD_SCENE
* GAME_SCENE

### preload-scene.ts

Scene chịu trách nhiệm tải toàn bộ tài nguyên của game.

Các loại tài nguyên được tải:

* Sprite
* Atlas
* Tilemap
* UI
* Font

Sau khi hoàn thành việc tải dữ liệu, Scene này sẽ chuyển sang GameScene.

### game-scene.ts

Scene gameplay chính.

Đây là nơi triển khai các tính năng cốt lõi của game:

* Điều khiển nhân vật
* Quái vật
* Chiến đấu
* NPC
* Nhiệm vụ
* Hệ thống vật phẩm
* Bản đồ

---

## src/common/

Chứa các thành phần dùng chung trong toàn bộ dự án.

### assets.ts

Quản lý key của tài nguyên game.

Toàn bộ asset sẽ được tham chiếu thông qua file này thay vì sử dụng chuỗi ký tự trực tiếp.

### types.ts

Định nghĩa các kiểu dữ liệu TypeScript dùng chung cho toàn bộ hệ thống.

### utils.ts

Chứa các hàm tiện ích hỗ trợ xử lý dữ liệu và gameplay.

### juice-utils.ts

Chứa các hiệu ứng giúp tăng cảm giác tương tác của game.

Ví dụ:

* Camera Shake
* Flash Effect
* Hit Effect
* Impact Effect

---

# public/assets/

Chứa toàn bộ tài nguyên tĩnh của game.

---

## data/

### assets.json

Manifest quản lý toàn bộ tài nguyên.

File này khai báo:

* Hình ảnh
* Atlas
* Tilemap
* Font

PreloadScene sẽ đọc file này để thực hiện việc tải dữ liệu.

---

## fonts/

Chứa các font sử dụng trong game.

### Press_Start_2P

Font pixel được sử dụng cho giao diện và HUD.

---

## images/

Chứa toàn bộ hình ảnh của game.

### player/

Tài nguyên liên quan đến nhân vật chính.

Bao gồm:

* Sprite Sheet
* Animation Frame Data
* Vũ khí

### enemies/

Tài nguyên của quái vật.

Bao gồm:

* Spider
* Wisp
* Drow

Mỗi loại quái vật đều có:

* Sprite
* Animation Data

### hud/

Tài nguyên giao diện hiển thị thông tin nhân vật.

Bao gồm:

* Thanh máu
* Số lượng vật phẩm
* Chỉ số HUD

### ui/

Tài nguyên giao diện người dùng.

Bao gồm:

* Hộp thoại
* Cursor
* Icon
* Menu

---

## levels/

Tài nguyên bản đồ.

### common/

Các tài nguyên dùng chung cho nhiều bản đồ.

Bao gồm:

* Collision Tileset
* Dungeon Objects
* Breakable Objects

### world/

Bản đồ thế giới chính.

Bao gồm:

* Tilemap
* Background Layer
* Foreground Layer

### dungeon_1/

Bản đồ hầm ngục đầu tiên.

Bao gồm:

* Tilemap
* Background Layer
* Foreground Layer

---

# Luồng hoạt động

Khi game khởi động:

main.ts

↓

PreloadScene

↓

Load toàn bộ tài nguyên

↓

GameScene

↓

Gameplay

---

# Mục tiêu của Template

Template này cung cấp sẵn nền tảng để phát triển:

* RPG 2D
* Adventure Game
* Zelda-like Game
* Monster Tamer Game

Các hệ thống đã được chuẩn bị sẵn:

* Scene Management
* Asset Management
* Tilemap System
* Animation System
* UI System
* Font System
* TypeScript Architecture

Nhờ đó lập trình viên có thể tập trung phát triển gameplay thay vì phải xây dựng cấu trúc dự án từ đầu.
