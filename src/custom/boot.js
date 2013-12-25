$(function(){
  load(); // Load cheatsheet
});

function load(){
  
  // say "wait" through label and main passage
  $("label").html('<span class="loading">読み込み中…</span>');
  $("#keyword").val("");  
  
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
  $("#keyword").removeAttr("disabled").focus();
  
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