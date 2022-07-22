import React, { useState } from "react"
import Grid from "@material-ui/core/Grid"
import TextField from "@material-ui/core/TextField"
import Switch from "@material-ui/core/Switch"
import FormGroup from "@material-ui/core/FormGroup"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import InputAdornment from "@material-ui/core/InputAdornment"
import Typography from "@material-ui/core//Typography"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import Dialog from "@material-ui/core/Dialog"
import DialogContent from "@material-ui/core/DialogContent"
import RadioGroup from "@material-ui/core/RadioGroup"
import Radio from "@material-ui/core/Radio"
import Select from "@material-ui/core/Select"
import Button from "@material-ui/core/Button"
import MenuItem from "@material-ui/core/MenuItem"
import Hidden from "@material-ui/core/Hidden"
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers"
import DateFnsUtils from "@date-io/date-fns"
import { format } from "date-fns"

import { makeStyles, useTheme } from "@material-ui/core/styles"

import AddIcon from "@material-ui/icons/Add"
import FilterListIcon from "@material-ui/icons/FilterList"

import EnhancedTable from "../src/ui/EnhancedTable"



const useStyles = makeStyles(theme => ({
  service: {
    fontWeight: 300,
  },
  users: {
    marginRight: 0,
  },
  button: {
    color: "#fff",
    backgroundColor: theme.palette.common.orange,
    borderRadius: 50,
    textTransform: "none",
    "&:hover": {
      backgroundColor: theme.palette.secondary.light,
    },
  },
}))

function createData(name, date, service, features, complexity, platforms, users, total, search) {
  return {
      name, 
      date, 
      service, 
      features, 
      complexity, 
      platforms, 
      users, 
      total,
      search,
  }
}

export default function ProjectManager() {
  const classes = useStyles();
  const theme = useTheme();
  const matchesMD = useMediaQuery(theme.breakpoints.down("md"))
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"))

  const platformOptions = ["Web", "iOS", "Android"]
  var featureOptions = ["Photo/Video", "GPS", "File Transfer", "Users/Authentication", "Biometrics", "Push Notifications"]
  var websiteOptions = ["Basic", "Interactive", "E-Commerce"]

  const [websiteChecked, setWebsiteChecked] = useState(false);
  const [iosChecked, setIosChecked] = useState(false);
  const [androidChecked, setAndroidChecked] = useState(false);
  const [softwareChecked, setSoftwareChecked] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);

  const [name, setName] = useState("")
  const [service, setService] = useState("")
  const [platforms, setPlatforms] = useState([])
  const [complexity, setComplexity] = useState("")
  const [features, setFeatures] = useState([])
  const [users, setUsers] = useState("")
  const [date, setDate] = useState(new Date())
  const [total, setTotal] = useState("")

  const [page, setPage] = React.useState(0);

  const websiteValidation = name.length === 0 || total.length === 0 || features.length === 0 || features.length > 1;
  const defaultValidation = name.length === 0 || total.length === 0 || features.length === 0 || users.length === 0 || complexity.length === 0 || platforms.length === 0 || service.length === 0

  const addProject = () => {
    setRows([...rows, 
      createData(
        name, 
        format(date, "dd/MM/yy"), 
        service, 
        features.join(", "), 
        service === "Website" ? "N/A" : complexity, 
        service === "Website" ? "N/A" : platforms.join(", "), 
        service === "Website" ? "N/A" : users, 
        `€ ${total}`,
        true
        )        
      ]);

      setDialogOpen(false);
      setName("")
      setService("")
      setPlatforms([])
      setComplexity("")
      setFeatures([])
      setUsers("")
      setDate(new Date)
      setTotal("")

  }

  const [rows, setRows] = useState([
    createData("Test 1", "28/10/20", "Website", "E-Commerce", "N/A", "N/A", "N/A", "€1500", true),
    createData("Test 2", "28/10/20", "Custom Software", "GPS, Push Notifications, Users/Authentication, FileTransfer", "Medium", "Web Application", "0-10", "€1600", true),
    createData("Test 3", "28/10/20", "Custom Software", "Photo/Video, FileTransfer, Users/Authentication", "Low", "Web Application", "10-100", "€1600", true),
  ])

  const [search, setSearch] = useState("")

  const handleSearch = event => {
    setSearch(event.target.value)

    const rowData = rows.map(row => Object.values(row).filter(option => option !== true && option !== false));
    const matches = rowData.map(row => 
      row.map(
        option => option.toLowerCase().includes(event.target.value.toLowerCase())
        )
      );
    const newRows = [...rows]
    matches.map((row, index) => row.includes(true) ? newRows[index].search = true : newRows[index].search = false)
    setRows(newRows)
    setPage(0);

  }

  const serviceQuestions = (
  <React.Fragment>
    <Grid item style={{marginTop: matchesSM ? 20 : null}}>
      <Typography variant="h4">Service</Typography>
    </Grid>
    <Grid item>
      <RadioGroup 
      aria-label="service" 
      name="service" 
      value={service} 
      onChange={(event) => {setService(event.target.value); setFeatures([])}}>
        <FormControlLabel classes={{label: classes.service}} value="Website" label="Website" control={<Radio />} />
        <FormControlLabel classes={{label: classes.service}} value="Mobile App" label="Mobile App" control={<Radio />} />
        <FormControlLabel classes={{label: classes.service}} value="Custom Software" label="Custom Software" control={<Radio />} />
      </RadioGroup>
    </Grid>
  </React.Fragment>
  )
  const complexityQuestions = (
    <Grid item>
      <Grid item container direction="column" style={{marginTop: matchesSM ? 50 : "5em"}}>
          <Grid item>
              <Typography variant="h4">Complexity</Typography>
          </Grid>
          <Grid item>
            <RadioGroup 
            aria-label="complexity" 
            name="complexity" 
            value={complexity} 
            onChange={(event) => setComplexity(event.target.value)}>
                <FormControlLabel disabled={service === "Website"} classes={{label: classes.service}} value="Low" label="Low" control={<Radio />} />
                <FormControlLabel disabled={service === "Website"} classes={{label: classes.service}} value="Medium" label="Medium" control={<Radio />} />
                <FormControlLabel disabled={service === "Website"} classes={{label: classes.service}} value="High" label="High" control={<Radio />} />
            </RadioGroup>
          </Grid>
      </Grid>
  </Grid>
  )

  const usersQuestions = (
    <Grid item style={{alignSelf: matchesSM ? "center" : "flex-end"}}>
        <Grid item container direction="column" style={{marginTop: matchesSM ? 50 :  "5em"}}>
          <Grid item>
            <Typography variant="h4">Users</Typography>
          </Grid>
          <Grid item>
            <RadioGroup 
              aria-label="users" 
              name="users" 
              value={users} 
              onChange={(event) => setUsers(event.target.value)}>
              <FormControlLabel disabled={service === "Website"} classes={{label: classes.service, root: classes.users}} value="0-10" label="0-10" control={<Radio />} />
              <FormControlLabel disabled={service === "Website"} classes={{label: classes.service, root: classes.users}} value="10-100" label="10-100" control={<Radio />} />
              <FormControlLabel disabled={service === "Website"} classes={{label: classes.service, root: classes.users}} value="100+" label="100+" control={<Radio />} />
            </RadioGroup>
          </Grid>
        </Grid>
      </Grid>
  )

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container direction="column" alignItems={matchesSM ? "center" : undefined}>
        <Grid item  style={{marginTop: "2em", marginLeft: matchesSM ? 0 : "5em"}}>
          <Typography variant="h1">
              Projects
          </Typography>
        </Grid>
        <Grid item>
          <TextField placeholder="Search project details or create a new entry."
          value={search}
          onChange={handleSearch} 
          style={{width: matchesSM ? "25em" : "35em", marginLeft: matchesSM ? 0 : "5em"}} InputProps={
            {endAdornment: <InputAdornment position="end" style={{cursor: "pointer"}} onClick={() => setDialogOpen(true)}>
                <AddIcon color="primary" style={{fontSize: 30}} />
            </InputAdornment>}}/>
        </Grid>
        <Grid item style={{marginLeft: matchesSM ? 0 : "5em", marginTop: "2em"}}>
          <FormGroup row>
            <Grid container direction={matchesSM ? "column" : "row"} justifyContent={matchesSM ? "center" : undefined}>
              <Grid item>
                <FormControlLabel 
                control={
                <Switch 
                    checked={websiteChecked} 
                    color="primary" 
                    onChange={() => setWebsiteChecked(!websiteChecked)} 
                  />} 
                  label="Website"
                  labelPlacement={matchesSM ? "end" : "start"}
                  style={{marginRight: matchesSM ? 0 : "5em"}}
                />
              </Grid>
              <Grid item>
                <FormControlLabel 
                control={
                <Switch 
                    checked={iosChecked} 
                    color="primary" 
                    onChange={() => setIosChecked(!iosChecked)} 
                  />} 
                  label="iOS Apps"
                  labelPlacement={matchesSM ? "end" : "start"}
                  style={{marginRight: matchesSM ? 0 : "5em"}}
                />
              </Grid>
              <Grid item>       
                <FormControlLabel 
                control={
                <Switch 
                    checked={androidChecked} 
                    color="primary" 
                    onChange={() => setAndroidChecked(!androidChecked)} 
                  />} 
                  label="Android Apps"
                  labelPlacement={matchesSM ? "end" : "start"}
                  style={{marginRight: matchesSM ? 0 : "5em"}}
                />
              </Grid>
              <Grid item>
                <FormControlLabel 
                control={
                <Switch 
                    checked={softwareChecked} 
                    color="primary" 
                    onChange={() => setSoftwareChecked(!softwareChecked)} 
                  />} 
                  label="Custom Software"
                  labelPlacement={matchesSM ? "end" : "start"}
                />
              </Grid>
            </Grid>
          </FormGroup>
        </Grid>
        <Grid item style={{marginBottom: matchesMD ? "40em" : "35em", marginTop: "5em", maxWidth:"100%"}}>
          <EnhancedTable
              rows={rows}
              setRows={setRows}
              page={page}
              setPage={setPage}
              websiteChecked={websiteChecked}
              setWebsiteChecked={setWebsiteChecked}
              iosChecked={iosChecked}
              setIosChecked={setIosChecked}
              androidChecked={androidChecked}
              setAndroidChecked={setAndroidChecked}
              softwareChecked={softwareChecked}
              setSoftwareChecked={setSoftwareChecked}
            />
        </Grid>
        <Dialog fullWidth fullScreen={matchesSM} maxWidth="md" open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogContent>
            <Grid container justify="center">
              <Grid item>
                <Typography variant="h1" gutterBottom>
                  Add a new project
                </Typography>
              </Grid>
            </Grid>
            <Grid container justifyContent="space-between" direction={matchesSM ? "column" : "row"} alignItems={matchesSM ? "center" : undefined}>
              <Grid item>
                <Grid item container direction="column" sm>
                  <Hidden mdUp>
                    {serviceQuestions}
                  </Hidden>
                  <Hidden mdUp>
                    {usersQuestions}
                  </Hidden>
                  <Hidden mdUp>
                    {complexityQuestions}
                  </Hidden>
                  <Grid item>
                      <TextField label="Name" id="name" value={name} fullWidth={!matchesSM} onChange={(event) => setName(event.target.value)}/>
                  </Grid>
                  <Grid item container direction="column" style={{marginTop: matchesSM ? 50 : "5em"}} alignItems={matchesSM ? "center" : undefined}>
                      <Hidden smDown>
                        {serviceQuestions}
                      </Hidden>                      
                    <Grid item style={{marginTop: matchesSM ? 50 : "5em"}}>
                      <Select labelId="platforms" id="platforms" disabled={service === "Website"} multiple value={platforms} displayEmpty renderValue={platforms.length > 0 ? undefined : () => "Choose some platforms"} MenuProps={{style: {zIndex: 1302}}} style={{width: "12em"}} onChange={(event) => setPlatforms(event.target.value)}>
                        {platformOptions.map(option => 
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>   
                        )}
                      </Select>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid item container direction="column" sm style={{marginTop: 16}} alignItems="center">
                  <Grid item style={{marginTop: matchesSM ? 50 : null}}>
                      <KeyboardDatePicker format="dd/MM/yyyy" value={date} onChange={(newDate) => setDate(newDate)} classes={{ classes: { root: classes.datePicker } }} />
                  </Grid>
                  <Hidden smDown>
                    {complexityQuestions}
                  </Hidden>
                </Grid>
              </Grid>
              <Grid item>
                <Grid item container direction="column" sm alignItems={matchesSM ? "center" : undefined}>
                  <Grid item style={{marginTop: matchesSM ? 50 : null}}>
                    <TextField 
                    label="Total" 
                    id="total" 
                    value={total}
                    fullWidth
                    InputProps={{startAdornment: 
                      <InputAdornment position="start">€</InputAdornment>
                    }}
                    onChange={(event) => setTotal(event.target.value)}/>
                  </Grid>
                  <Hidden smDown>
                    {usersQuestions}
                  </Hidden>
                  <Grid item style={{marginTop: matchesSM ? 50 : "5em"}}>
                      <Select labelId="features" id="features" multiple value={features} displayEmpty renderValue={features.length > 0 ? undefined : () => "Choose some features"} MenuProps={{style: {zIndex: 1302}}} style={{width: "12em"}} onChange={(event) => setFeatures(event.target.value)}>
                        {service === "Website" ? featureOptions = websiteOptions : null}
                        {featureOptions.map(option => 
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>   
                        )}
                      </Select>
                    </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid container justify="center" style={{marginTop: "3em"}}>
              <Grid item>
                <Button color="primary" style={{fontWeight: 300}} onClick={() => setDialogOpen(false)}>Cancel</Button>
              </Grid>
              <Grid item>
                <Button 
                variant="contained" 
                className={classes.button}
                disabled={service === "Website" ? websiteValidation : defaultValidation} 
                onClick={() => addProject()}>
                  Add Project +
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      </Grid>
    </MuiPickersUtilsProvider>
  )
}
