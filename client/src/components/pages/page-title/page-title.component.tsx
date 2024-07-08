import { Box, Chip, Grid, IconButton, Typography } from "@mui/material";
import { PageTitleParams, TagDTO } from "../types/pages.types";
import { Edit } from "react-feather";
import { useEffect, useState } from "react";
import { editPage } from "../../../services/pages.service";
import { deletePage } from "../../../api/page.api";
import CreationDialog from "../../general/create-dialog/creation-dialog.component";
import { useToolStore } from "../../../states/global.store";

function PageTitle({
  currentPage,
  fetchPagesData,
  fetchPageById,
  setSnackbar,
}: PageTitleParams) {
  const [open, setOpen] = useState<boolean>(false);
  const [label, setLabel] = useState<string>("");
  const [parentId, setParentId] = useState<number>(-1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [, setLoading] = useState<boolean>(false);
  const setCurrentPageId = useToolStore((state: any) => state.setCurrentPageId);

  useEffect(() => {
    setLabel(currentPage.label);
    setParentId(currentPage.parent_page ? currentPage.parent_page : -1);
    handleTags();
  }, [currentPage]);

  const handleOpen = () => {
    setOpen((open) => !open);
  };

  const handleTags = () => {
    setSelectedTags(currentPage.tags.map((element: TagDTO) => element.id));
  };

  const handleEditPage = async () => {
    setLoading(true);
    let parent_page_id = parentId !== -1 ? parentId : null;
    editPage(+currentPage.id, {
      label: label,
      parent_page_id: parent_page_id,
      tags: selectedTags,
    })
      .then(() => {
        setSnackbar({
          message: "Page successfully edited.",
          type: "success",
          open: true,
        });
      })
      .then(() => {
        fetchPagesData();
        fetchPageById(+currentPage.id);
      })
      .catch(() => {
        setSnackbar({
          message: "Error: Page could not be edited.",
          type: "error",
          open: true,
        });
      })
      .finally(() => setLoading(false));
  };

  const handleDeletePage = async () => {
    deletePage(+currentPage.id)
      .then(() => {
        setSnackbar({
          message: "Page successfully deleted.",
          type: "success",
          open: true,
        });
      })
      .then(() => {
        fetchPagesData();
        setCurrentPageId(-1);
      })
      .catch(() => {
        setSnackbar({
          message: "Error: Page could not be deleted.",
          type: "error",
          open: true,
        });
      });
  };

  return (
    <>
      <Grid container sx={{ mt: "4vh", ml: "2vw", mr: "2vw" }}>
        <Grid
          item
          xs={8}
          sx={{ display: "flex", justifyContent: "flex-start" }}
        >
          <Typography variant="h4" color="#5a5a5a">
            <b>{currentPage.label}</b>
          </Typography>
        </Grid>
        <Grid item xs={4} sx={{ display: "flex", justifyContent: "center" }}>
          {!currentPage.read_only && (
            <IconButton
              onClick={handleOpen}
              style={{ border: "none", outline: "none" }}
            >
              <Edit />
            </IconButton>
          )}
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            mt: "1.5vh",
          }}
        >
          <Box sx={{ maxHeight: "10vh", overflow: "auto" }}>
            {currentPage.tags.map((tag: any) => {
              return (
                <Chip
                  key={tag.id}
                  label={
                    <Typography variant="body2" color="#5a5a5a">
                      <b>#{tag.label}</b>
                    </Typography>
                  }
                  size="small"
                  sx={{
                    backgroundColor: tag.color,
                    mr: "0.25rem",
                    mb: "0.25rem",
                  }}
                />
              );
            })}
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            mt: "1vh",
            mr: "4vw",
            borderBottom: "solid 1px #d6d6d6",
          }}
        ></Grid>
      </Grid>
      <CreationDialog
        open={open}
        setOpen={setOpen}
        label={label}
        setLabel={setLabel}
        parentId={parentId}
        setParentId={setParentId}
        selectedElements={currentPage.tags}
        selectedTagOrLabel={selectedTags}
        setSelectedTagOrLabel={setSelectedTags}
        editItem={handleEditPage}
        deleteItem={handleDeletePage}
        type="edit"
        source="page"
      />
    </>
  );
}

export default PageTitle;
