"use strict";!function(s,e){e(window),e("body"),s.Break;var a=e(".nk-ibx-reply-header"),i=e(".tagify");s.Message=function(){a.on("click",function(s){e(this).hasClass("is-opened")||0<e(s.target).parents(".nk-reply-tools").length||(e(this).hasClass("is-collapsed")?e(this).removeClass("is-collapsed").next().addClass("is-shown"):e(this).hasClass("is-collapsed")||e(this).addClass("is-collapsed").next().removeClass("is-shown"))}),i.exists()&&"function"==typeof e.fn.tagify&&i.tagify()},s.coms.docReady.push(s.Message)}(NioApp,jQuery);