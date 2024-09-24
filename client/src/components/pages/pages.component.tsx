import { Button, Grid, Typography } from "@mui/material";
import { SidebarParams } from "../../types/sidebar/sidebar.types";
import { Edit } from "react-feather";
import { lazy, Suspense, useEffect, useState } from "react";
import CustomSnackbar from "../general/snackbar/snackbar.component";
import { useToolStore } from "../../states/global.store";
import { addPage, getPageById, getPages } from "../../services/pages.service";
import CreationDialog from "../general/create-dialog/creation-dialog.component";
import LoadingComponent from "../general/loading-component/loading.component";
import { getChatsByPageId } from "../../services/chats.service";
import { ChatDTO } from "../../types/chatbot/chatbot.types";
import { useQuery } from "react-query";
import EmptyChat from "../chatbot/empty-chat/empty-chat.component";
import { PageDTO } from "../../types/page/page.types";
const PageTitle = lazy(() => import("./page-title/page-title.component"));
const ChatTable = lazy(() => import("./chat-table/chat-table.component"));
const PageTreeView = lazy(
  () => import("./page-tree-view/page-tree-view.component")
);

function Pages({ open }: SidebarParams) {
  const [currentPage, setCurrentPage] = useState<PageDTO>();
  const currentPageId = useToolStore((state: any) => state.currentPageId);
  const setCurrentPageId = useToolStore((state: any) => state.setCurrentPageId);
  const [currentChats, setCurrentChats] = useState<ChatDTO[]>([]);
  const [parentId, setParentId] = useState(-1);
  const pages = useToolStore((state: any) => state.pages);
  const setPages = useToolStore((state: any) => state.setPages);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [snackbar, setSnackbar] = useState({
    message: "",
    type: "",
    open: false,
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { data: fetchedPages } = useQuery("pages", getPages, {
    onSuccess: setPages,
  });
  const { data: currentPageData } = useQuery(
    ["page", currentPageId],
    () => fetchPageById(currentPageId),
    {
      enabled: currentPageId >= 0,
    }
  );

  const { data: currentChatsData } = useQuery(
    ["page_chats", currentPageId],
    () => fetchChatsByPageId(currentPageId),
    {
      enabled: currentPageId >= 0,
    }
  );

  useEffect(() => {
    if (fetchedPages) {
      setPages(fetchedPages);
    }
  }, [fetchedPages, setPages]);

  useEffect(() => {
    if (currentPage) {
      setCurrentPage(currentPage);
    }
  }, [currentPageData, setCurrentPage]);

  useEffect(() => {
    if (currentChatsData) {
      setCurrentChats(currentChatsData);
    }
  }, [currentChatsData, setCurrentChats]);

  const handleClose = (
    _event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbar({
      message: snackbar.message,
      type: snackbar.type,
      open: false,
    });
  };

  const fetchPagesData = async () => {
    setLoading(true);
    getPages()
      .then((res: PageDTO[]) => setPages(res))
      .finally(() => setLoading(false));
  };

  const fetchPageById = async (pageId: number) => {
    setPageLoading(true);
    getPageById(pageId)
      .then((res: PageDTO) => setCurrentPage(res))
      .finally(() => setPageLoading(false));
  };

  const fetchChatsByPageId = async (pageId: number) => {
    setPageLoading(true);
    getChatsByPageId(pageId)
      .then((res: ChatDTO[]) => setCurrentChats(res))
      .finally(() => setPageLoading(false));
  };

  const handleAddPage = async () => {
    let parent_page_id = parentId !== -1 ? parentId : null;
    console.log(loading);
    console.log(pageLoading);
    addPage({
      label: label,
      parent_page_id: parent_page_id,
      tags: selectedTags,
    })
      .then(() => {
        setSnackbar({
          message: "Page successfully created",
          type: "success",
          open: true,
        });
      })
      .then(() => fetchPagesData())
      .catch(() => {
        setSnackbar({
          message: "Error: Page could not be created",
          type: "error",
          open: true,
        });
      });
  };

  return (
    <>
      <Grid container className={open ? "chat open" : "chat close"}>
        <Grid
          item
          xs={3}
          sx={{
            height: "100vh",
            borderRight: "solid 1px #d6d6d6",
          }}
        >
          <Grid container sx={{ mt: "4vh", pr: "1vw", pl: "1vw" }}>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                fullWidth
                style={{
                  border: "none",
                  background: "#f3f3f3",
                  outline: "none",
                }}
                sx={{ textTransform: "false" }}
                onClick={() => setDialogOpen(true)}
              >
                <Grid
                  container
                  sx={{ mt: "5px", ml: "3px", mr: "3px", mb: "5px" }}
                >
                  <Grid
                    item
                    xs={10}
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2" color="#5a5a5a">
                      <b>New Page</b>
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={2}
                    sx={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <Edit color="#5a5a5a" />
                  </Grid>
                </Grid>
              </Button>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: "4vh",
              }}
            >
              <Suspense fallback={<LoadingComponent />}>
                <PageTreeView
                  pages={pages}
                  currentPageId={currentPageId}
                  setCurrentPageId={setCurrentPageId}
                  isNewPage={false}
                />
              </Suspense>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          xs={9}
          sx={{
            height: "100vh",
          }}
        >
          <Grid container>
            {currentPageId == -1 ? (
              <Grid item xs={12}>
                <EmptyChat message={`Open a page to find the respective chats.`}/>
              </Grid>
            ) : (
              <>
                <Grid item xs={12}>
                  <Suspense fallback={<LoadingComponent />}>
                    {currentPage && (
                      <PageTitle
                        currentPage={currentPage}
                        fetchPagesData={fetchPagesData}
                        fetchPageById={fetchPageById}
                        setSnackbar={setSnackbar}
                      />
                    )}
                  </Suspense>
                </Grid>
                <Grid item xs={12} sx={{ ml: "2rem", mr: "2rem", mt: "2rem" }}>
                  <Suspense fallback={<LoadingComponent />}>
                    {currentPage && (
                      <ChatTable
                        chats={currentChats}
                        fetchChatsByPageId={fetchChatsByPageId}
                        setSnackbar={setSnackbar}
                        currentPageId={currentPageId}
                      />
                    )}
                  </Suspense>
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
      </Grid>
      <CreationDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        label={label}
        setLabel={setLabel}
        parentId={parentId}
        setParentId={setParentId}
        createItem={handleAddPage}
        selectedTagOrLabel={selectedTags}
        setSelectedTagOrLabel={setSelectedTags}
        type="create"
        source="page"
      />
      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        type={snackbar.type}
        handleClose={handleClose}
      />
    </>
  );
}

export default Pages;
