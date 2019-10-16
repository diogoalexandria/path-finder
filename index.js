var columns = 50;
var rows = 50;
var grid = new Array(columns);

var widthArena;
var heightArena;

function removeFromArray(array, element) {
    for (var i = array.length - 1; i >= 0; i--) {
        if(array[i] == element) {
            array.splice(i, 1);
        }
    }
}

function heuristic(spotA, spotB) {
    // var d = dist(spotA.i, spotA.j, spotA.i, spotB.j);
    var d = abs(spotA.i-spotB.i) + abs(spotA.j-spotB.j);
    return d;
}

function Spot(i, j) {
    this.x = i;
    this.y = j;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.neighbors = [];
    this.previous = undefined;
    this.wall = false;

    if(random(1) < 0.3){
        this.wall = true;
    }

    this.show = function(color) {
        fill(color);
        if (this.wall) {
            fill(0);
        }
        noStroke();
        // stroke(0);   
        rect(this.x * widthSpotArena, this.y * heightSpotArena, widthSpotArena - 1, heightSpotArena - 1);
    }

    this.addNeighbors = function(grid) {        
        if (this.x < columns - 1) {
            this.neighbors.push(grid[i + 1][j]);
        }
        if (this.x > 0) {
            this.neighbors.push(grid[i - 1][j]);
        }
        if (this.y < rows - 1) {
            this.neighbors.push(grid[i][j + 1]);
        }
        if (this.y > 0) {
            this.neighbors.push(grid[i][j - 1]);
        }
        if (i > 0 && j > 0) {
            this.neighbors.push(grid[i - 1][j - 1])
        }
        if (i > columns - 1  && j > 0) {
            this.neighbors.push(grid[i + 1][j - 1])
        }
        if (i > 0 && j > rows -1) {
            this.neighbors.push(grid[i - 1][j + 1])
        }
        if (i > columns - 1 && j > rows -1) {
            this.neighbors.push(grid[i + 1][j + 1])
        }       
    }
}

var openSet = [];
var closedSet = [];
var start;
var end;
var path = [];

function setup() {
    createCanvas(500, 500);

    widthSpotArena = width / columns;
    heightSpotArena = height / rows;

    // Criando a matriz
    for (var i = 0; i < columns; i++) {
        grid[i] = new Array(rows);
    };

    for (var i = 0; i < columns; i++) {
        for ( var j = 0; j < rows; j++) {
            grid[i][j] = new Spot(i,j);             
        }
    }

    for (var i = 0; i < columns; i++) {
        for ( var j = 0; j < rows; j++) {
            grid[i][j].addNeighbors(grid);             
        }
    }

    start = grid[0][0];
    end = grid[columns-1][rows-1];
    start.wall = false;
    end.wall = false;

    openSet.push(start);
}

function draw() {

    if (openSet.length > 0) {

        var winner = 0;
        for (i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[winner].f) {
                winner = i;
            }
        }

        var current = openSet[winner]

        if (current === end) {
            path = [];
            var temp = current;
            while (temp.previous) {
                path.push(temp.previous);
                temp = temp.previous;
            }

            console.log("Done");
        }

        removeFromArray(openSet, current);
        closedSet.push(current);

        var neighbors = current.neighbors;
        for (var i = 0; i < neighbors.length; i++) {
            
            var neighbor = neighbors[i];

            if (!closedSet.includes(neighbor) && !neighbor.wall) {
                var tempG = current.g + 1;
                if (openSet.includes(neighbor)) {
                    if (tempG < neighbor.g) {
                        neighbor.g = tempG;
                    }
                } else {
                    neighbor.g = tempG;
                    openSet.push(neighbor);
                }

                neighbor.h = heuristic(neighbor, end);
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.previous = current;
            }            
        }

    } else {
        console.log('No Solution!');
        noLoop();
        return;
    }

    background(0)

    for (var i = 0; i < columns; i++) {
        for ( var j = 0; j < rows; j++) {
            grid[i][j].show(color(255)); 
        }
    }

    for (var i = 0; i < closedSet.length; i++) {
        closedSet[i].show(color(255,0,0));
    }

    for (var i = 0; i < openSet.length; i++) {
        openSet[i].show(color(0,255,0));
    }

    for (var i = 0; i < path.length; i++) {
        path[i].show(color(0, 0, 255));
    }
}