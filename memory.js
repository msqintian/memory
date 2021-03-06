// YOUR CODE GOES HERE
var DEFAULTSIZE = 2;
var MAXSIZE = 10;
var table, currentSize, lastTile, score=0;

Array.prototype.shuffle = function() {
  var i = this.length, j, temp;
  if ( i === 0 ) return this;
  while ( --i ) {
     j = Math.floor( Math.random() * ( i + 1 ) );
     temp = this[i];
     this[i] = this[j];
     this[j] = temp;
  }
  return this;
};

Array.prototype.print = function(){
  for(var i=0, l=this.length; i<l; ++i){
    console.log("value " + i + " : " + this[i] );
  }
};

var PairedRandomValues = {
  generate: function(m, n){
    var pairedValues = [];
    var l = m*n/2;
    for(var i=0; i<l; ++i){
      var randomNumber = Math.floor(Math.random() * 10 + 1);
      pairedValues.push(randomNumber);
      pairedValues.push(randomNumber);
    }
    pairedValues.shuffle();
    return pairedValues;
  }
};

var Table = function(m,n){
  this.rows = m;
  this.columns = n;
};

Table.prototype.initialize = function(){
  var randomValues = PairedRandomValues.generate(this.rows, this.columns);

  function addTileToEachRow(){
    $('tr').each(function(i, val){
      var value = randomValues.pop();
      var tile = new Tile(value, i, j);
      $(this).append(tile.$el);
    });
  }

  $('body').append('<table></table>');
  for(var i=0, l=this.rows; i<l; ++i){
    $('table').append('<tr></tr>');
  }
  for(var j=0, l2=this.columns; j<l2; ++j){
    addTileToEachRow();
  }
};

Table.prototype.destroy = function(){
  if($('table').length > 0){
    $('table').remove();
  }
};

Table.prototype.reset = function(){
  this.destroy();
  this.resetLastTile();
  this.resetScore();
  table = new Table(currentSize, currentSize);
  table.initialize();
};

Table.prototype.resetLastTile = function(){
  lastTile = undefined;
};

Table.prototype.resetScore = function(){
  score = 0;
  $('#score').html(score);
};

var Tile = function(value, x, y){
  this.value = value;
  this.id = x*currentSize + y;
  this.$el = $('<td><span></span>' + value + '</td>');
  this.visible = !this.$el.hasClass('flipped');
  this.$el.on('click', this.flip.bind(this));
};

Tile.prototype.flip = function(){
  $(this.$el).toggleClass('flipped');
  if(!this.visible){
    return;
  }
  //currently a tile is opened
  if(lastTile){

    if(this.id != lastTile.id && this.value == lastTile.value){
      this.disapear();
      lastTile.disapear();
      table.resetLastTile();
      score += 1;
      $('#score').html(score);
    }else{
      this.close();
      lastTile.close();
      table.resetLastTile();
    }
  }else{
    lastTile = this;
  }
};

Tile.prototype.disapear = function(){
  (function($el){
    setTimeout(function(){
    $el.empty();
  }, 400);
  })(this.$el);
  this.$el.unbind('click');
};

Tile.prototype.close = function(){
  (function($el){
    setTimeout(function(){
    $el.removeClass('flipped');
  }, 400);
  })(this.$el);
};

$(document).ready(function(){

  currentSize = DEFAULTSIZE;
  table = new Table(currentSize, currentSize);
  table.initialize();
  $('#memorySize').on('change', function(){
    var value = $(this).val();
    if(value  > MAXSIZE){
      alert("Please enter an even number that is no more than " + MAXSIZE +"!");
      return;
    }
    if(value <= 0 || (value % 2) > 0){
      alert("Please enter an even number!");
      return;
    }
    if(value != currentSize){
      currentSize = value;
      table.reset();
    }  
  });

  $('#reset').on('click', function(){
    table.reset();
  });
});
