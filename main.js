// ==UserScript==
// @name         紳士漫畫頁面縮放
// @name:zh-TW   紳士漫畫頁面縮放
// @name:zh-CN   绅士漫画页面缩放
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description         在頁面頂部的下拉選單調整漫畫圖片尺寸
// @description:zh-TW   在頁面頂部的下拉選單調整漫畫圖片尺寸
// @description:zh-CN   在页面顶部的下拉选单调整漫画图片尺寸
// @author       Lin_tsen
// @match        https://www.wnacg.com/photos-slist-aid*
// @grant        none
// @license      MIT
// ==/UserScript==
 
(function() {
    'use strict';
 
    // 調整圖片尺寸的函數
    function adjustImageSize(percentage) {
        const images = document.querySelectorAll('img');
        const screenWidth = window.innerWidth;
        const targetWidth = (screenWidth * percentage) / 100;
 
        images.forEach(img => {
            img.style.maxWidth = targetWidth + 'px';
            img.style.width = 'auto';
            img.style.height = 'auto';
            img.style.margin = '0 auto';
            img.style.display = 'block';
        });
 
        // 保存設定到 localStorage
        localStorage.setItem('mangaImageSize', percentage);
    }
 
    // 等待 album_tabs 加載
    function initSizeControl() {
        const albumTabs = document.getElementById('album_tabs');
 
        if (!albumTabs) {
            setTimeout(initSizeControl, 100);
            return;
        }
 
        // 创建 li 元素
        const li = document.createElement('li');
        li.style.cssText = `
            display: inline-block;
            vertical-align: bottom;
            line-height: inherit;
        `;
 
        // 創建標籤
        const label = document.createElement('span');
        label.textContent = '圖片尺寸：';
        label.style.cssText = `
            color: #ffffff;
            font-size: 14px;
            font-weight: 500;
            vertical-align: middle;
            margin-right: 5px;
            display: inline-block;
        `;
 
        // 創建下拉選單
        const select = document.createElement('select');
        select.style.cssText = `
            padding: 3px 8px;
            border: 1px solid #444;
            border-radius: 4px;
            background: #2a2a2a;
            color: #ddd;
            cursor: pointer;
            font-size: 14px;
            outline: none;
            vertical-align: middle;
        `;
 
        select.addEventListener('mouseenter', function() {
            this.style.borderColor = '#666';
        });
 
        select.addEventListener('mouseleave', function() {
            this.style.borderColor = '#444';
        });
 
        // 添加選項
        const options = [
            { value: '100', text: '原始大小 (100%)' },
            { value: '75', text: '大尺寸 (75%)' },
            { value: '50', text: '中尺寸 (50%)' },
            { value: '25', text: '小尺寸 (25%)' }
        ];
 
        options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.text;
            select.appendChild(option);
        });
 
        // 從 localStorage 讀取上次的設定
        const savedSize = localStorage.getItem('mangaImageSize') || '100';
        select.value = savedSize;
 
        // 監聽下拉選單變化
        select.addEventListener('change', function() {
            adjustImageSize(this.value);
        });
 
        // 組裝並添加到 album_tabs
        li.appendChild(label);
        li.appendChild(select);
        albumTabs.appendChild(li);
 
        // 監聽新圖片載入（使用 MutationObserver）
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.tagName === 'IMG') {
                            adjustImageSize(select.value);
                        }
                    });
                }
            });
        });
 
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
 
        // 延遲應用設定，確保圖片已載入
        setTimeout(() => {
            adjustImageSize(savedSize);
        }, 500);
 
        // 監聽窗口載入完成
        window.addEventListener('load', function() {
            adjustImageSize(savedSize);
        });
    }
 
    // 開始初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSizeControl);
    } else {
        initSizeControl();
    }
})();
