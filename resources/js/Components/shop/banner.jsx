import React from 'react'
import anime from 'animejs/lib/anime.es.js';
anime({
    targets: '.line-drawing-demo .lines path',
    strokeDashoffset: [anime.setDashoffset, 0],
    easing: 'easeInOutSine',
    duration: 1500,
    delay: function(el, i) { return i * 250 },
    direction: 'alternate',
    loop: true
  });
export default function ShopBanner() {
  return (
    <div className='bannerShop'>
      <iframe className="w-full h-full" src="https://glamoure.net/collections" frameborder="0" ></iframe>          
    </div>
  )
}
