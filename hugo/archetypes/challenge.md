---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
coverImage: images/placeholder600x400.png
summary: |
---

<style>
    canvas {
        display: block;
    }
</style>


<div class="my-5 pb-5" id="sketch-holder" style="position: relative;">
    <script src="./sketch.js"></script>
</div>