/* Flot plugin for adding cursors to the plot.

Copyright (c) cipix2000@gmail.com.
Copyright (c) 2007-2014 IOLA and Ole Laursen.
Licensed under the MIT license.
*/

/*global jQuery*/

(function ($) {
    'use strict';

    var options = {
        cursors: [
        ]
    };

    function init(plot) {
        var cursors = [];
        var update = [];

        function createCursor(options) {
            return mixin(options, {
                name: options.name || ('unnamed ' + cursors.length),
                x: 0,
                y: 0,
                selected: false,
                highlighted: false,
                mode: 'xy',
                showIntersections: false,
                showLabel: false,
                color: 'gray',
                lineWidth: 1
            });
        }

        plot.hooks.processOptions.push(function (plot) {
            plot.getOptions().cursors.forEach(function (options) {
                plot.addCursor(options);
            });
        });

        plot.getCursors = function () {
            return cursors;
        };

        plot.addCursor = function addCursor(options) {
            var currentCursor = createCursor(options);

            setPosition(plot, currentCursor, options.position);
            cursors.push(currentCursor);

            plot.triggerRedrawOverlay();
        };

        plot.removeCursor = function removeCursor(cursor) {
            var index = cursors.indexOf(cursor);

            if (index !== -1) {
                cursors.splice(index, 1);
            }

            plot.triggerRedrawOverlay();
        };

        plot.setCursor = function setCursor(cursor, options) {
            var index = cursors.indexOf(cursor);

            if (index !== -1) {
                mixin(options, cursors[index]);
                setPosition(plot, cursors[index], cursors[index].position);
                plot.triggerRedrawOverlay();
            }
        };

        plot.getIntersections = function getIntersections(cursor) {
            var index = cursors.indexOf(cursor);

            if (index !== -1) {
                return cursors[index].intersections;
            }

            return [];
        };

        function onMouseOut(e) {
            /*
                maybe stop drag when the mouse leaves the chart ?
            */
        }

        var selectedCursor = function (cursors) {
            var result;

            cursors.forEach(function (cursor) {
                if (cursor.selected) {
                    if (!result)
                        result = cursor;
                }
            });

            return result;
        };

        var selectCursor = function (cursors, cursor) {
            cursors.forEach(function (c) {
                if (c === cursor) {
                    c.selected = true;
                } else {
                    c.selected = false;
                }
            });
        };

        function onMouseDown(e) {
        	if (e.button === 2) { // We want it work only with right click
	            var offset = plot.offset();
	            var mouseX = Math.max(0, Math.min(e.pageX - offset.left, plot.width()));
	            var mouseY = Math.max(0, Math.min(e.pageY - offset.top, plot.height()));
	
	            var currentlySelectedCursor = selectedCursor(cursors);
	
	            if (currentlySelectedCursor) {
	                // unselect the cursor and move it to the current position
	                currentlySelectedCursor.selected = false;
	                plot.getPlaceholder().css('cursor', 'default');
	                currentlySelectedCursor.x = mouseX;
	                currentlySelectedCursor.y = mouseY;
	                plot.triggerRedrawOverlay();
	            } else {
	                // find nearby cursor and unlock it
	                var targetCursor;
	                var dragmode;
	
	                cursors.forEach(function (cursor) {
	                    if (mouseOverCursorHorizontalLine(e, plot, cursor)) {
	                        targetCursor = cursor;
	                        dragmode = 'y';
	                    }
	                    if (mouseOverCursorVerticalLine(e, plot, cursor)) {
	                        targetCursor = cursor;
	                        dragmode = 'x';
	                    }
	                    if (mouseOverCursorManipulator(e, plot, cursor)) {
	                        targetCursor = cursor;
	                        dragmode = 'xy';
	                    }
	                });
	
	                if (targetCursor) {
	                    targetCursor.selected = true;
	                    targetCursor.dragmode = dragmode;
	                    plot.getPlaceholder().css('cursor', 'move');
	                    plot.triggerRedrawOverlay();
	                }
	            }
	        }
        }

        function onMouseUp(e) {
        	if (e.button === 2) { // We want it work only with right click
	            var offset = plot.offset();
	            var mouseX = Math.max(0, Math.min(e.pageX - offset.left, plot.width()));
	            var mouseY = Math.max(0, Math.min(e.pageY - offset.top, plot.height()));
	            var currentlySelectedCursor = selectedCursor(cursors);
	
	            if (currentlySelectedCursor) {
	                // lock the free cursor to current position
	                currentlySelectedCursor.selected = false;
	                if (currentlySelectedCursor.dragmode.indexOf('x') != -1) {
	                    currentlySelectedCursor.x = mouseX;
	                }
	                if (currentlySelectedCursor.dragmode.indexOf('y') != -1) {
	                    currentlySelectedCursor.y = mouseY;
	                }
	                plot.getPlaceholder().css('cursor', 'default');
	                plot.triggerRedrawOverlay();
	            }
	        }
        }

        function onMouseMove(e) {
        	//if (e.button === 2) { // We want it work only with right click
	            var offset = plot.offset();
	            var mouseX = Math.max(0, Math.min(e.pageX - offset.left, plot.width()));
	            var mouseY = Math.max(0, Math.min(e.pageY - offset.top, plot.height()));
	
	            var currentlySelectedCursor = selectedCursor(cursors);
	
	            if (currentlySelectedCursor) {
	                if (currentlySelectedCursor.dragmode.indexOf('x') != -1) {
	                    currentlySelectedCursor.position.relativeX = Math.max(0, Math.min(e.pageX - offset.left, plot.width()));
	                    currentlySelectedCursor.x = currentlySelectedCursor.position.relativeX;
	                }
	                if (currentlySelectedCursor.dragmode.indexOf('y') != -1) {
	                    currentlySelectedCursor.position.relativeY = Math.max(0, Math.min(e.pageY - offset.top, plot.height()));
	                    currentlySelectedCursor.y = currentlySelectedCursor.position.relativeY;
	                }
	
	                plot.triggerRedrawOverlay();
	            } else {
	                cursors.forEach(function (cursor) {
	                    if (mouseOverCursorManipulator(e, plot, cursor)) {
	                        if (!cursor.highlighted) {
	                            cursor.highlighted = true;
	                            plot.triggerRedrawOverlay();
	                        }
	                        plot.getPlaceholder().css('cursor', 'pointer');
	                    } else if (mouseOverCursorVerticalLine(e, plot, cursor)) {
	                        if (!cursor.highlighted) {
	                            cursor.highlighted = true;
	                            plot.triggerRedrawOverlay();
	                        }
	                        plot.getPlaceholder().css('cursor', 'col-resize');
	                    } else if (mouseOverCursorHorizontalLine(e, plot, cursor)) {
	                        if (!cursor.highlighted) {
	                            cursor.highlighted = true;
	                            plot.triggerRedrawOverlay();
	                        }
	                        plot.getPlaceholder().css('cursor', 'row-resize');
	                    } else {
	                        if (cursor.highlighted) {
	                            cursor.highlighted = false;
	                            plot.getPlaceholder().css('cursor', 'default');
	                            plot.triggerRedrawOverlay();
	                        }
	                    }
	                });
	            }
	        //}
        }

        plot.hooks.bindEvents.push(function (plot, eventHolder) {
            eventHolder.mousedown(onMouseDown);
            eventHolder.mouseup(onMouseUp);
            eventHolder.mouseout(onMouseOut);
            eventHolder.mousemove(onMouseMove);
        });

        function findIntersections(plot, cursor) {
            var pos = plot.c2p({
                left: cursor.x,
                top: cursor.y
            });

            var intersections = {
                cursor: cursor.name,
                x: pos.x,
                y: pos.y,
                points: []
            };

            var axes = plot.getAxes();
            if (pos.x < axes.xaxis.min || pos.x > axes.xaxis.max ||
                pos.y < axes.yaxis.min || pos.y > axes.yaxis.max) {
                return;
            }

            var i, j, dataset = plot.getData();

            for (i = 0; i < dataset.length; ++i) {

                var series = dataset[i];

                // Find the nearest points, x-wise
                for (j = 0; j < series.data.length; ++j) {
                    if (series.data[j][0] > pos.x) {
                        break;
                    }
                }

                // Now Interpolate
                var y,
                    p1 = series.data[j - 1],
                    p2 = series.data[j];

                if (p1 === undefined) {
                    y = p2[1];
                } else if (p2 === undefined) {
                    y = p1[1];
                } else {
                    y = p1[1] + (p2[1] - p1[1]) * (pos.x - p1[0]) / (p2[0] - p1[0]);
                }
                pos.y = y;
                pos.y1 = y;

                intersections.points.push({
                    x: pos.x,
                    y: pos.y
                });
            }

            return intersections;
        }

        plot.hooks.drawOverlay.push(function (plot, ctx) {
            var i = 0;
            update = [];
            var intersections;

            cursors.forEach(function (cursor) {
                var plotOffset = plot.getPlotOffset();

                ctx.save();
                ctx.translate(plotOffset.left, plotOffset.top);

                setPosition(plot, cursor, cursor.position, intersections);
                intersections = findIntersections(plot, cursor);
                maybeSnapToPlot(plot, cursor, intersections);

                if (cursor.x != -1) {
                    drawVerticalAndHorizontalLines(plot, ctx, cursor);

                    cursor.intersections = intersections;
                    update.push(intersections);

                    drawLabelAndIntersections(plot, ctx, cursor);
                    drawManipulator(plot, ctx, cursor);
                }
                ctx.restore();
                i++;
            });

            plot.getPlaceholder().trigger('cursorupdates', [update]);
        });

        plot.hooks.shutdown.push(function (plot, eventHolder) {
            eventHolder.unbind("mousedown", onMouseDown);
            eventHolder.unbind("mouseup", onMouseUp);
            eventHolder.unbind("mouseout", onMouseOut);
            eventHolder.unbind("mousemove", onMouseMove);
            eventHolder.unbind("cursorupdates");
            plot.getPlaceholder().css('cursor', 'default');
        });
    }

    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'cursors',
        version: '0.1'
    });

    function mixin(source, destination) {
        Object.keys(source).forEach(function (key) {
            destination[key] = source[key];
        });

        return destination;
    }

    function setPosition(plot, cursor, pos) {
        if (!pos)
            return;

        if ((pos.relativeX !== undefined) && (pos.relativeY !== undefined)) {
            cursor.x = Math.max(0, Math.min(pos.relativeX, plot.width()));
            cursor.y = Math.max(0, Math.min(pos.relativeY, plot.height()));
        } else {
            var o = plot.p2c(pos);
            cursor.x = Math.max(0, Math.min(o.left, plot.width()));
            cursor.y = Math.max(0, Math.min(o.top, plot.height()));
        }
    }

    function maybeSnapToPlot(plot, cursor, intersections) {
        if (cursor.snapToPlot !== undefined) {
            var point = intersections.points[cursor.snapToPlot];
            if (point) {
                setPosition(plot, cursor, {
                    x: point.x,
                    y: point.y
                });

                intersections.y = point.y; // update cursor position
            }
        }
    }

    function drawLabelAndIntersections(plot, ctx, cursor) {
        ctx.beginPath();
        if (cursor.showLabel) {
            var x = cursor.x + 10;
            var y = cursor.y - 10;
            ctx.fillStyle = cursor.color;
            ctx.fillText(cursor.name, x, y);
        }

        if (cursor.showIntersections && hasVerticalLine(cursor)) {
            cursor.intersections.points.forEach(function (point) {
                var coord = plot.p2c(point);
                ctx.fillStyle = 'darkgray';
                ctx.fillRect(Math.floor(coord.left) - 4, Math.floor(coord.top) - 4, 8, 8);
                ctx.fillText(point.y.toFixed(2), coord.left + 8, coord.top + 8);
            });
        }
        ctx.stroke();
    }

    function drawVerticalAndHorizontalLines(plot, ctx, cursor) {
        var adj = cursor.lineWidth % 2 ? 0.5 : 0;

        ctx.strokeStyle = cursor.color;
        ctx.lineWidth = cursor.lineWidth;
        ctx.lineJoin = "round";

        ctx.beginPath();

        if (cursor.mode.indexOf("x") != -1) {
            var drawX = Math.floor(cursor.x) + adj;
            ctx.moveTo(drawX, 0);
            ctx.lineTo(drawX, plot.height());
        }
        if (cursor.mode.indexOf("y") != -1) {
            var drawY = Math.floor(cursor.y) + adj;
            ctx.moveTo(0, drawY);
            ctx.lineTo(plot.width(), drawY);
        }

        ctx.stroke();
    }

    function drawManipulator(plot, ctx, cursor) {
        var adj = cursor.lineWidth % 2 ? 0.5 : 0;
        ctx.beginPath();

        if (cursor.highlighted)
            ctx.strokeStyle = 'orange';
        else
            ctx.strokeStyle = cursor.color;
        if (cursor.symbol && plot.drawSymbol && plot.drawSymbol[cursor.symbol]) {
            ctx.fillStyle = 'white';
            ctx.fillRect(Math.floor(cursor.x) + adj - 5, Math.floor(cursor.y) + adj - 5, 10, 10);
            plot.drawSymbol[cursor.symbol](ctx, Math.floor(cursor.x) + adj, Math.floor(cursor.y) + adj, 4, 0);
        } else {
            ctx.fillRect(Math.floor(cursor.x) + adj - 4, Math.floor(cursor.y) + adj - 4, 8, 8);
        }

        ctx.stroke();
    }

    function hasVerticalLine(cursor) {
        return (cursor.mode.indexOf('x') != -1);
    }

    function hasHorizontalLine(cursor) {
        return (cursor.mode.indexOf('y') != -1);
    }

    function mouseOverCursorManipulator(e, plot, cursor) {
        var offset = plot.offset();
        var mouseX = Math.max(0, Math.min(e.pageX - offset.left, plot.width()));
        var mouseY = Math.max(0, Math.min(e.pageY - offset.top, plot.height()));

        return ((mouseX > cursor.x - 8) && (mouseX < cursor.x + 8) && (mouseY > cursor.y - 8) && (mouseY < cursor.y + 8));
    }

    function mouseOverCursorVerticalLine(e, plot, cursor) {
        var offset = plot.offset();
        var mouseX = Math.max(0, Math.min(e.pageX - offset.left, plot.width()));
        var mouseY = Math.max(0, Math.min(e.pageY - offset.top, plot.height()));

        return (hasVerticalLine(cursor) && (mouseX > cursor.x - 4) && (mouseX < cursor.x + 4) && (mouseY > 0) && (mouseY < plot.height()));
    }

    function mouseOverCursorHorizontalLine(e, plot, cursor) {
        var offset = plot.offset();
        var mouseX = Math.max(0, Math.min(e.pageX - offset.left, plot.width()));
        var mouseY = Math.max(0, Math.min(e.pageY - offset.top, plot.height()));

        return (hasHorizontalLine(cursor) && (mouseY > cursor.y - 4) && (mouseY < cursor.y + 4) && (mouseX > 0) && (mouseY < plot.width()));
    }
})(jQuery);