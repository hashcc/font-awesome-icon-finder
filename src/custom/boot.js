$(function(){
  load(); // Load cheatsheet
});

function load(){
  
  // say "wait" through label and main passage
  $("label").html('<span class="loading">読み込み中…</span>');
  $("#keyword").hide();
  
  var url = "http://fortawesome.github.io/Font-Awesome/cheatsheet/";
  var selector = "div.row";
  
  $.ajax({
    url: url,
    type: "get",
    cache: true,
    
    success: function(resource){
      content = $(resource.responseText).find(selector).html();
      content = content
                .replace(/\&amp;/g, '&')
                .replace(/<span class=\"muted\">\(&#xf([0-9a-z]{3});\)<\/span>/g, '<span class="unicode">\\f\$1</span>')
                .replace(/col\-md\-4 col\-sm\-6 col\-lg\-3/g, "col-md-12 icon")
                .replace(/<p>fa\-/g, "<p>");
　　　$("#icons").html(content);
      
      // boot input Filter
      bootFilter();
      // Add copy button
      //setCopyButton();
    }
  });
  
}

function bootFilter(){
  
  var preFunc  = null, preInput = "", input = "";
  var interval = 500; // ms
  
  // say "OK" through input-field
  $("label").html("探したいアイコンのキーワードを入れてください");
  // let the input-field enable
  
  $(".progress").hide();
  $("#keyword").show().focus();
  stickElement("keyword", 10);
  addAliasNames();
  sortIcons();
  
  // Do filtering if last keyup event + [interval]ms passed
  $("#keyword").on("keyup", function(){
    input = $.trim($(this).val());
    if (preInput !== input){
      clearTimeout(preFunc);
      preFunc = setTimeout(doFilter, interval, input);
    }
    preInput = input;
  });
}

function doFilter(input){
  
  // Before filter
  $("#status").html("絞り込み中です…");
  
  // On filter
  $(".icon").each(function(){
    var str = $.trim($(this).find("p").text());
    if (str.indexOf(input) != -1){
      $(this).removeClass("hide");
    } else{
      $(this).addClass("hide");
    }
  });
  
  if (($(".icon").length) == ($(".hide").length)){
    $("#status").attr("class", "alert alert-warning").html('"'+input+'"を含んだアイコンはありませんでした (´・ω・｀)');
  } else if ($(".hide").length == 0){
    $("#status").removeClass().html("");
  } else{
    $("#status").attr("class", "alert alert-info").html("絞り込みできました（"+($(".icon").length - $(".hide").length)+"個）");
  }
  
  // observes icon click
  //click2copy();
  
}

function addAliasNames(){
  var arr = {
    "adjust": "reverse",
    "archive": "box",
    "arrow-circle-o-right": "link",
    "arrow-circle-right": "link",
    "arrows-h": "change, size",
    "arrows-v": "change, size",
    "asterisk": "kome",
    "ban": "deny, not",
    "bell": "ring",
    "bullhorn": "kakuseiki",
    "camera": "photo",
    "certificate": "bomb, bakuhatsu",
    "chevron-down": "expand",
    "chevron-left": "fold",
    "chevron-right": "expand, drilldown",
    "chevron-up": "fold",
    "cog": "gear, config, setting",
    "comment": "info",
    "crosshairs": "map, position, current",
    "envelope-o": "mail",
    "exclamation": "bikkuri, caution, warning, error",
    "eye": "view",
    "female": "woman",
    "file": "paper, new",
    "globe": "earth, internet",
    "hdd-o": "harddisk",
    "headphones": "sound",
    "male": "man",
    "minus": "delete",
    "pencil": "edit",
    "picture": "photo",
    "plus": "add, expand",
    "power-off": "reboot",
    "question-circle": "hatena",
    "refresh": "reload",
    "rss": "feed",
    "search": "glass",
    "sign-in": "login",
    "sign-out": "logout",
    "signal": "denpan, antenna, ktai",
    "thumb-tack": "pin",
    "thumbs-down": "ikunaine",
    "thumbs-up": "iine",
    "thumbs-o-down": "ikunaine",
    "thumbs-o-up": "iine",
    "times": "batu, batsu, not, delete, error",
    "trash-o": "gomibako",
    "user": "man, people"
  };
  
  $("p").each(function(){
    for (var key in arr){
      var word = " " + $(this).text();
      if (word.indexOf(" " + key) !== -1){
        $(this).children("span").before('<span class="tags">'+ arr[key] +'</span>');
      }
    }
  });
}

function sortIcons(){
  $('#icons').html(
    $('#icons > .icon').sort(function(a, b) {
      return $(b).children("p").text() < $(a).children("p").text() ? 1 : -1;
    })
  );
}

function stickElement(id, topSpacing){

  if ($("#"+id).size() == 0) return;
  
  var target = $("#"+id).offset().top - topSpacing;
  var scrolled = 0;
  $(document).scroll(function(){
    $("#"+id).css("top", topSpacing + "px");
    scrolled = $(this).scrollTop();
    // スクロール距離がboxの位置を超えたら
    if (target <= scrolled) {
      $("#"+id).addClass('follow');
    // スクロールがページ上まで戻ったら
    } else if (target >= scrolled) {
      $("#"+id).removeClass('follow');
      $("#"+id).css("top", "");
    }
  });
  
}

function setCopyButton(){
  
  $(".fa").each(function(){
    $(this).before('<input type="button" class="copy" value="コピー" title="'+ $(this).text() +'" />');
  });
  
}

function click2copy(){
  
  $("input.copy").zclip({
    path: "./src/jquery/jquery.zclip.swf",
    copy: $(this).attr("title"),
    beforeCopy: function(){
      console.log($(this));
    },
    afterCopy: function(){
      console.log($(this).attr("title"));
    }
  });

}