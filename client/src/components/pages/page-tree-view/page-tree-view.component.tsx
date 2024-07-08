import Box from "@mui/material/Box";
import {
  RichTreeView,
  TreeViewBaseItem,
  TreeViewItemId,
} from "@mui/x-tree-view";
import { useTreeViewApiRef } from "@mui/x-tree-view/hooks";
import { SyntheticEvent, useEffect, useState } from "react";
import { useToolStore } from "../../../states/global.store";
import { Alert, Typography } from "@mui/material";
import { PageDTO } from "../types/pages.types";
import { getPageById } from "../../../services/pages.service";

function PageTreeView({
  currentPageId,
  setCurrentPageId,
  isNewPage,
  isEditMode,
}: any) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const pageId = useToolStore((state: any) => state.currentPageId);
  const pages = useToolStore((state: any) => state.pages);
  const apiRef = useTreeViewApiRef();
  const [, setEditPage] = useState<PageDTO | null>(null);

  const getAllItemsWithChildrenItemIds = () => {
    const itemIds: TreeViewItemId[] = [];
    const registerItemId = (item: TreeViewBaseItem) => {
      if (item.children?.length) {
        itemIds.push(item.id.toString());
        item.children.forEach(registerItemId);
      }
    };
    pages.forEach(registerItemId);
    return itemIds;
  };

  useEffect(() => {
    if (isEditMode) {
      getPageById(pageId).then((res) => setEditPage(res));
    }
  }, []);

  useEffect(() => {
    if (isNewPage && pages) {
      handleExpandClick();
    }
  }, [pages]);

  const handleExpandClick = () => {
    setExpandedItems((_oldExpanded) => getAllItemsWithChildrenItemIds());
  };

  const handleExpandedItemsChange = (
    _event: React.SyntheticEvent,
    itemIds: string[]
  ) => {
    setExpandedItems(itemIds);
  };

  const handleSelectedItemsChange = (
    _event: SyntheticEvent<Element, Event> | null,
    id: string
  ) => {
    setCurrentPageId(id);
  };

  const getObjectDepth = (obj: any, currentDepth = 0): number => {
    // Base case: if the object is not an object or is null, return the current depth
    if (obj === null || typeof obj !== "object") {
      return currentDepth;
    }

    // Initialize the maximum depth to the current depth
    let maxDepth = currentDepth;

    // Iterate over each property in the object
    if (obj.hasOwnProperty("children")) {
      // Recursively get the depth of the nested object
      const depth = getObjectDepth(obj["children"], currentDepth + 1);
      // Update the maximum depth
      if (depth > maxDepth) {
        maxDepth = depth;
      }
    }

    return maxDepth;
  };

  if (pages === null || pages.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexGrow: 1,
        }}
      >
        <Alert severity="info">
          <Typography>
            You do not have any <b>pages</b> yet!
          </Typography>
        </Alert>
      </Box>
    );
  }

  const isItemDisabled = (page: PageDTO) => {
    if (isNewPage) {
      if (page.level == 2) {
        return true;
      }
      return false;
    }
    if(isEditMode) {
      return true;
    }
    return false;
  };

  function getItemId(item: any) {
    return String(item.id);
  }

  return (
    <Box sx={{ minHeight: 200, flexGrow: 1, maxWidth: 400 }}>
      <RichTreeView
        sx={{ color: "#5a5a5a" }}
        apiRef={apiRef}
        items={pages}
        getItemId={getItemId}
        isItemDisabled={isItemDisabled}
        selectedItems={String(currentPageId)}
        onItemFocus={handleSelectedItemsChange}
        expandedItems={expandedItems}
        onExpandedItemsChange={handleExpandedItemsChange}
      />
    </Box>
  );
}

export default PageTreeView;
