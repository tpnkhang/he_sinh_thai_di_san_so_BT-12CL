# Hệ sinh thái Di sản số — Website VR IUH

Website HTML/CSS/JavaScript thuần dùng trong học phần **Kỹ năng làm việc nhóm** của nhóm **Bạch Tuyết và 12 chú lùn**, lớp **DHĐTMT22B**, Đại học Công nghiệp TP.HCM.

## 1. Khởi chạy

1. Giải nén ZIP.
2. Mở thư mục `heritage-blue` trong VS Code.
3. Mở `index.html` bằng Live Server; hoặc mở Terminal ở thư mục này, chạy `python -m http.server 8000`, truy cập `http://localhost:8000`.
4. Cần Internet để tải thư viện Three.js/JSZip khi chạy trong cấu hình hiện tại (giống trình VR gốc).

## 2. Luồng sử dụng

`index.html` → bấm một trong ba địa điểm → mở `vr/*.html` → video giới thiệu → tự chuyển sang VR khi hết video; hoặc bấm **Bắt đầu tham quan VR** để bỏ qua video. `nhom.html` giới thiệu 13 thành viên và nhiệm vụ từ tệp nhóm được cung cấp. Website không đăng số điện thoại cá nhân.

## 3. Nội dung thư mục

```text
heritage-blue/
├── index.html
├── nhom.html
├── vr/
│   ├── vr-buu-dien.html
│   ├── vr-chien-dich.html
│   └── vr-my-thuat.html
├── assets/
│   ├── logo/iuh.png                   ← logo IUH đã được cung cấp
│   ├── images/
│   │   ├── buu-dien/                  ← có ảnh đại diện buu-dien.jpg
│   │   ├── chien-dich/                ← cần ảnh chien-dich.jpg
│   │   ├── my-thuat/                  ← cần ảnh my-thuat.jpg
│   │   └── nhom/                      ← chân dung tùy chọn
│   └── videos/                        ← cần 3 video giới thiệu
├── css/
├── js/
├── data/team.json
├── templates/                      ← mẫu trang VR để build lại
└── scripts/build.mjs
```

## 4. Bổ sung ảnh

Mỗi thư mục bối cảnh hiện có tệp **`CHEN_ANH_TAI_DAY.txt`** ghi rõ phải đặt ảnh gì. Cấu trúc ví dụ:

```text
assets/images/my-thuat/san-trong/
├── CHEN_ANH_TAI_DAY.txt
├── panorama.jpg   ← nếu đã ghép panorama tỉ lệ 2:1
├── 1.jpg          ← hoặc ảnh chụp vòng tròn
├── 2.jpg
└── ... n.jpg
```

Khi sử dụng ảnh rời, sửa `count` cho đúng số ảnh trong `js/scenes.js`. Với hai bảo tàng, trình xem ưu tiên `panorama.jpg`; nếu chưa có, sẽ thử các ảnh 1.jpg ... n.jpg. Với Bưu điện, dữ liệu 6 trạm + ảnh nhúng + hotspot từ tệp VR gốc vẫn có thể sử dụng và được dùng làm dự phòng khi thư mục ảnh mới chưa có gì. Nếu thêm panorama mới cho Bưu điện, trình xem sẽ ưu tiên nó.

Ảnh rời được dựng thành **bản xem thử** bằng cách trích dải giữa của từng ảnh; để có toàn cảnh liền mạch như Google Street View, cần ghép panorama đúng kỹ thuật.

## 5. Bổ sung video

Đặt 3 tệp MP4 vào `assets/videos/`:

- `buu-dien-sai-gon.mp4`
- `bao-tang-chien-dich-hcm.mp4`
- `bao-tang-my-thuat-hcm.mp4`

Nên dùng MP4 H.264, 1080p. Khi chưa có video, giao diện có thông báo cập nhật và cho phép bắt đầu VR ngay.

## 6. Phần kỹ thuật

- `css/site.css`: giao diện sáng xanh – trắng cho Home và Nhóm.
- `css/vr.css`, `css/vr-extra.css`, `css/vr-blue.css`: giao diện VR xanh đồng bộ.
- `js/vr-postoffice-data.js`: 6 trạm và ảnh VR Bưu điện trích từ dữ liệu gốc.
- `js/vr-config.js`: dữ liệu từng địa điểm, đường dẫn ảnh.
- `js/scenes.js`: sơ đồ điểm đứng dự kiến và số lượng ảnh.
- `js/vr-viewer.js`: mô hình 3D, chuyển trạm, hotspot, tải ảnh, nhập thư mục/ZIP.
- `js/vr-intro.js`: xử lý video mở đầu, tự chuyển sang VR khi video kết thúc.
- `data/team.json`: thông tin 13 thành viên.
- `scripts/build.mjs`: dựng lại Home, Nhóm, 3 trang VR và tệp ghi chú. **Việc chạy script ghi đè HTML và các tệp chú thích**; cần sao lưu trước nếu bạn đã chỉnh thủ công.

## 7. Những gì đã có và chưa có

**Đã có:** logo IUH, ảnh bìa Bưu điện, 13 thành viên, 6 trạm VR Bưu điện từ file gốc, các trang HTML và luồng video → VR, 18 thư mục bối cảnh có hướng dẫn.

**Chưa có trong dữ liệu đã gửi:** hai ảnh đại diện còn lại, ba video, ảnh VR chụp thực tế của hai bảo tàng và các chân dung thành viên nếu muốn dùng.

Các điểm kết nối của hai bảo tàng là **tuyến tham quan đề xuất**, phải đối chiếu với vị trí quay/chụp thật trước khi công bố.
