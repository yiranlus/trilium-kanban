module.exports = async function(context) {
    const {
      $view,
      helpers,
      kanban,
      settings: { showCardIcons, useCustomColors },
    } = context;
    
    const boardIds = helpers.getBoardIds($view);
    const cardIds = [];
    boardIds.forEach(boardId => cardIds.push(
        ...helpers.getCardIds(kanban, boardId)
    ));
    
    $view.find(".kanban-item").each((index, card) => {
        const $card = $(card);
        const text = $card.text();
        const {
            tags,
            progress,
            kanbanstyle,
            iconclass
        } = $card.data();

        $card.empty();
        
        if (useCustomColors && kanbanstyle) {
            $card.addClass("kanban-style-" + kanbanstyle);
        }
        
        var $cardTitle = $('<div/>', {class: "kanban-item-title"});
        if (showCardIcons && iconclass) {
            const $iconSpan = $('<span/>', {class: iconclass})
            $cardTitle.append($iconSpan);
        }
        
        const $title = $('<span/>', {text});
        $cardTitle.append($title);
        
        console.log("progress: ", progress);
        if (progress) {
        	const $progress = $('<span/>', {
                text: `(${progress})`,
                css: {
                    marginLeft: "0.5em"
                }
            });
        	$cardTitle.append($progress);
        }
        
        $card.append($cardTitle);
        
        // adding tags
        tags.split(',').forEach(tag => {
            if (!tag) return;

            var bgcolor = "lightgreen";

            if (tag === "important" || tag === "urgent") {
                bgcolor = "orangered";
            } else if (tag === "medium") {
                bgcolor = "orange";
            } else if (tag === "maybe") {
                bgcolor = "lightblue";
            }

            $card.append($("<span/>", {
                class: "kanban-tag",
                text: tag,
                css: {
                    backgroundColor: bgcolor,
                    color: "black"
                }
            }));
        });
    });
}