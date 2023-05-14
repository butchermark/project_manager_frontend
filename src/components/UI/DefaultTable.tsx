import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
} from "@mui/material";

export const DefaultTable = ({ headers, data }: any) => {
  return (
    <Container
      sx={{
        display: "flex",
        width: "100%",
        overflow: "hidden",
        marginTop: "5px",
      }}
    >
      <TableContainer
        sx={{
          display: "flex",
          marginBottom: "50px",
        }}
        component={Paper}
      >
        <Table
          sx={{
            width: "100%",
            overflow: "hidden",
          }}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              {headers.map((header: any, index: any) => (
                <TableCell key={index}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>{data}</TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};