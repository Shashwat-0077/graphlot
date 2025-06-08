Rules to follow in the chart config

As we have 5 types of charts so 

# Radar
### X-Axis 
we can only have types that have classes
- Status
- Select
- Multi-select

Types like these are not considered
- Date
- Number
- Text

### Y-Axis
we can only have types that have classes
- Status
- Select
- Multi-select

Types like these are not considered
- Date
- Number
- Text

# Bar, area
### X-Axis
we can only have types like
- Number
- Status
- Select
- Multi-select
- Date (can be like class like weekly, monthly) // this can be added later

Types like these are not considered
- Text

### Y-Axis
we can only have types like

    in notion they just count the number of distinct values according to classes on X-axis like for eg

    X Axis : Collection
    Y Axis : Difficulty

    Top 150 have easy medium so the chart will display 2
    Blind 75 have easy so that will display 1 

- Number
- Status 
- Select
- Multi-select
- Date (can be like class like weekly, monthly) // this can be added later

Types like these are not considered
- Text

# Donut
### X-Axis
we can have classes on this 
- Status
- Select
- Multi-select

Group by or each slice represent will also count distinct values just like bar or line

# HeatMap
### X-Axis
we will only have date as the X-Axis
- Date

### Y-Axis
- Count only 

