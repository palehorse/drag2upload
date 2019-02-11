## drag2upload
拖曳電腦中的某張圖片到指定的DOM上，即可上傳圖片到網站上某個指定目錄
## 前置安裝
    jQuery
## 安裝
1.用npm指令安裝
```sh
npm install drag2upload
```
2.用html語法引入
```html
<script src="drag2upload/drag2upload.jquery.js"></script>
```
#### Vue
```javascript
require('drag2upload/drag2upload.jquery.js');
```
## 使用方法
#### 基本用法
```javascript
$('.drag-upload-area').drag2upload();
```
## 必傳參數
#### name
```javascript
// 檔名
$('.drag-upload-area').drag2upload({
    name: 'avatar'
});
```
#### uploadFileUrl
```javascript
// 指出能夠處理上傳圖片的程式路徑
$('.drag-upload-area').drag2upload({
    uploadFileUrl: '/upload/file/handler'
});
```

## 其他參數
#### csrf
```javascript
// CSRF token
$('.drag-upload-area').drag2upload({
    csrf: $('meta[name="csrf-token"]').attr('content')
});
```
#### refreshCsrfUrl
```javascript
// 當CSRF token逾期時，可以更新的程式路徑
$('.drag-upload-area').drag2upload({
    refreshCsrfUrl: '/csrf/token/refresh'
});
```

## Callbacks
#### onDragOver
```javascript
$('.drag-upload-area').drag2upload({
    onDragOver: function() {
        // Doing something when dragging a picture over the area.
    }
});
```

#### onDragOut
```javascript
$('.drag-upload-area').drag2upload({
    onDragOut: function() {
        // Doing something when dragging a picture out the area.
    }
});
```

#### onDrop
```javascript
$('.drag-upload-area').drag2upload({
    onDrop: function() {
        // Doing something after dropping a picture on the area.
    }
});
```

#### onUploaded
```javascript
$('.drag-upload-area').drag2upload({
    onUploaded: function() {
        // Doing something after uploading successfully.
    }
});
```

#### onError
```javascript
$('.drag-upload-area').drag2upload({
    onError: function() {
        // Doing something once uploading fails.
    }
});
```

#### onRefreshCSRFFail
```javascript
$('.drag-upload-area').drag2upload({
    onRefreshCSRFFail: function() {
        // Doing something after the CSRF token refreshes.
    }
});
```
