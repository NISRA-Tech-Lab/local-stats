
df_meta_data <- data.frame()

# Read in script to extract names of tables needed
this_script <- read_lines("create_jsons/read_all_dataportal_tables_in.R") %>% .[12:length(.)]

tables_needed <- this_script[grepl("dataset_long <-", this_script)] %>%
  gsub("dataset_long <- ", "", ., fixed = TRUE) %>%
  gsub('"', "", ., fixed = TRUE) %>%
  unique()

# All metadata from data portal read in:
data_portal <- jsonlite::fromJSON(txt = "https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.ReadCollection")$link$item

matrices <- data_portal$extension$matrix
years <- data_portal$dimension$`TLIST(A1)`$category$index
updated <- data_portal$updated

titles <- c()
updates <- c()
id_cols <- c()

for (i in 1:length(tables_needed)) {
  
  titles[i] <- data_portal$label[which(matrices == tables_needed[i])]
  updates[i] <- substr(updated[which(matrices == tables_needed[i])], 1, 10)
  id_cols[i] <- paste(data_portal$id[[which(matrices == tables_needed[i])]], collapse = "; ") %>%
    gsub("TLIST(A1); STATISTIC; ", "", ., fixed = TRUE)
  
  
}

updates_table <- data.frame(table = tables_needed,
                            title = titles,
                            updated = as.Date(updates),
                            id_cols = id_cols)

date_of_last_run <- readRDS("create_jsons/date_of_last_run.RDS")

## Example date for testing
# date_of_last_run$date <- as.Date("2024-04-10")

tables_with_updates <- updates_table %>%
  filter(updated >= date_of_last_run$date)

geog_types_to_update <- c("ctry")

for (geog_type in c("dea", "lgd", "sdz", "dz")) {
  
  for (id in tables_with_updates$id_cols) {
    if (substr(id, 1, nchar(geog_type)) == toupper(geog_type)) {
      geog_types_to_update <- c(geog_types_to_update, geog_type)
      break
    }
  }
  
}


#### Population ####

##### MYEs #####
##### population, totals
df_pop <- list()

dataset_short <- "MYETotal"
dataset_subject <- "5/MYE"

##### MYE by LGD #####
dataset_long <- "MYE01T06"
latest_year <- years[[which(matrices == dataset_long)]] %>% tail(1)

json_data <- jsonlite::fromJSON(
  txt = transform_URL(paste0(
    'https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/',
    dataset_subject, '/', dataset_long,
    '?query={"query": [{"code": "TLIST(A1)", "selection": {"filter": "item", "values": ["', latest_year, '"]}},',
    '{"code": "rounded_unrounded", "selection": {"filter": "item", "values": ["Unrounded"]}}],',
    '"response": {"format": "json-stat2", "pivot": null}}'
  ))
)

df_meta_data <- rbind(df_meta_data, t(c(
  dataset = dataset_short,
  "table_code" = dataset_long,
  "year" = latest_year,
  "geog_level" = "lgd",
  "dataset_url" = paste0("https://data.nisra.gov.uk/table/", dataset_long),
  "last_updated" = format(substring(updated[which(matrices == dataset_long)], 1, 10), format = "%a"),
  "email" = json_data$extension$contact$email,
  "title" = data_portal$label[which(matrices == dataset_long)],
  "note" = json_data$note
)))

data <- data.frame(geog_code = json_data$dimension$LGD2014$category$index,
                    VALUE = json_data$value,
                    source = dataset_short)

df_pop <- rbind(df_pop, data)

##### MYE by Data Zone #####
dataset_long <- "MYE01T011"
latest_year <- years[[which(matrices == dataset_long)]] %>% tail(1)

json_data <- jsonlite::fromJSON(
  txt = transform_URL(paste0(
    'https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/',
    dataset_subject, '/', dataset_long,
    '?query={"query": [{"code": "TLIST(A1)", "selection": {"filter": "item", "values": ["', latest_year, '"]}}],',
    '"response": {"format": "json-stat2", "pivot": null}}'
  ))
)

df_meta_data <- rbind(df_meta_data, t(c(
  dataset = dataset_short,
  "table_code" = dataset_long, "year" = latest_year,
  "geog_level" = "dz",
  "dataset_url" = paste0("https://data.nisra.gov.uk/table/", dataset_long),
  "last_updated" = format(substring(updated[which(matrices == dataset_long)], 1, 10), format = "%a"),
  "email" = json_data$extension$contact$email,
  "title" = data_portal$label[which(matrices == dataset_long)],
  "note" = json_data$note
)))

data <- data.frame(geog_code = json_data$dimension$DZ2021$category$index,
                    VALUE = json_data$value,
                    source = dataset_short) %>%
  filter(geog_code != "N92000002")

df_pop <- rbind(df_pop, data)

##### MYE by Super Data Zone #####
dataset_long <- "MYE01T012"
latest_year <- years[[which(matrices == dataset_long)]] %>% tail(1)

json_data <- jsonlite::fromJSON(
  txt = transform_URL(paste0(
    'https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/',
    dataset_subject, '/', dataset_long,
    '?query={"query": [{"code": "TLIST(A1)", "selection": {"filter": "item", "values": ["', latest_year, '"]}},',
    '{"code": "Sex", "selection": {"filter": "item", "values": ["All"]}},',
    '{"code": "broadage4", "selection": {"filter": "item", "values": ["All"]}}],',
    '"response": {"format": "json-stat2", "pivot": null}}'
  ))
)


df_meta_data <- rbind(df_meta_data, t(c(
  dataset = dataset_short,
  "table_code" = dataset_long, "year" = latest_year,
  "geog_level" = "sdz",
  "dataset_url" = paste0("https://data.nisra.gov.uk/table/", dataset_long),
  "last_updated" = format(substring(updated[which(matrices == dataset_long)], 1, 10), format = "%a"),
  "email" = json_data$extension$contact$email,
  "title" = data_portal$label[which(matrices == dataset_long)],
  "note" = json_data$note
)))

data <- data.frame(geog_code = json_data$dimension$SDZ2021$category$index,
                    VALUE = json_data$value,
                    source = dataset_short) %>%
  filter(geog_code != "N92000002")

df_pop <- rbind(df_pop, data)

##### MYE by DEA ####
dataset_long <- "MYE01T010"
latest_year <- years[[which(matrices == dataset_long)]] %>% tail(1)

json_data <- jsonlite::fromJSON(
  txt = transform_URL(paste0(
    'https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/',
    dataset_subject, '/', dataset_long,
    '?query={"query": [{"code": "TLIST(A1)", "selection": {"filter": "item", "values": ["', latest_year, '"]}},',
    '{"code": "Sex", "selection": {"filter": "item", "values": ["All"]}},',
    '{"code": "broadage4", "selection": {"filter": "item", "values": ["All"]}}],',
    '"response": {"format": "json-stat2", "pivot": null}}'
  ))
)

df_meta_data <- rbind(df_meta_data, t(c(
  dataset = dataset_short,
  "table_code" = dataset_long, "year" = latest_year,
  "geog_level" = "dea",
  "dataset_url" = paste0("https://data.nisra.gov.uk/table/", dataset_long),
  "last_updated" = format(substring(updated[which(matrices == dataset_long)], 1, 10), format = "%a"),
  "email" = json_data$extension$contact$email,
  "title" = data_portal$label[which(matrices == dataset_long)],
  "note" = json_data$note
)))

data <- data.frame(geog_code = json_data$dimension$DEA2014$category$index,
                   VALUE = json_data$value,
                   source = dataset_short) %>%
  filter(geog_code != "N92000002")

df_pop <- rbind(df_pop, data)
df_pop <- unique(df_pop)

##### median age ####
dataset_short <- "Median"

dataset_long <- "MA01T02"
latest_year <- years[[which(matrices == dataset_long)]] %>% tail(1)

json_data <- jsonlite::fromJSON(
  txt = transform_URL(paste0(
    'https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/',
    dataset_subject, '/', dataset_long,
    '?query={"query": [{"code": "TLIST(A1)", "selection": {"filter": "item", "values": ["', latest_year, '"]}},',
    '{"code": "Sex", "selection": {"filter": "item", "values": ["All"]}}],',
    '"response": {"format": "json-stat2", "pivot": null}}'
  ))
)

df_meta_data <- rbind(df_meta_data, t(c(
  dataset = dataset_short,
  "table_code" = dataset_long, "year" = latest_year,
  "geog_level" = "lgd",
  "dataset_url" = paste0("https://data.nisra.gov.uk/table/", dataset_long),
  "last_updated" = format(substring(updated[which(matrices == dataset_long)], 1, 10), format = "%a"),
  "email" = json_data$extension$contact$email,
  "title" = data_portal$label[which(matrices == dataset_long)],
  "note" = json_data$note
)))

data <- data.frame(geog_code = json_data$dimension$LGD2014$category$index,
                   VALUE = json_data$value,
                   source = dataset_short)

df_pop <- rbind(df_pop, data)



##### age band ####
df_popage <- list()
dataset_short <- "BroadAge"

dataset_long <- "MYE01T012"
latest_year <- years[[which(matrices == dataset_long)]] %>% tail(1)

json_data <- jsonlite::fromJSON(
  txt = transform_URL(paste0(
    'https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/',
    dataset_subject, '/', dataset_long,
    '?query={"query": [{"code": "TLIST(A1)", "selection": {"filter": "item", "values": ["', latest_year, '"]}},',
    '{"code": "Sex", "selection": {"filter": "item", "values": ["All"]}},',
    '{"code": "broadage4", "selection": {"filter": "item", "values": ["1", "2", "3", "4"]}}],',
    '"response": {"format": "json-stat2", "pivot": null}}'
  ))
)

df_meta_data <- rbind(df_meta_data, t(c(
  dataset = dataset_short,
  "table_code" = dataset_long, "year" = latest_year,
  "geog_level" = "sdz",
  "dataset_url" = paste0("https://data.nisra.gov.uk/table/", dataset_long),
  "last_updated" = format(substring(updated[which(matrices == dataset_long)], 1, 10), format = "%a"),
  "email" = json_data$extension$contact$email,
  "title" = data_portal$label[which(matrices == dataset_long)],
  "note" = json_data$note
)))

categories <- unlist(json_data$dimension$broadage4$category$label)

data <- data.frame(geog_code = sort(rep(json_data$dimension$SDZ2021$category$index, length(categories)))) %>%
  mutate(statistic = rep_len(categories, nrow(.)),
         VALUE = json_data$value,
         source = dataset_short) %>%
  group_by(geog_code) %>%
  mutate(perc = VALUE / sum(VALUE) * 100) %>%
  filter(geog_code != "N92000002")

df_popage <- rbind(df_popage, data)

##### Age band by LGD ####
dataset_long <- "MYE01T04"
latest_year <- years[[which(matrices == dataset_long)]] %>% tail(1)

json_data <- jsonlite::fromJSON(
  txt = transform_URL(paste0(
    'https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/',
    dataset_subject, '/', dataset_long,
    '?query={"query": [{"code": "TLIST(A1)", "selection": {"filter": "item", "values": ["', latest_year, '"]}},',
    '{"code": "Sex", "selection": {"filter": "item", "values": ["All"]}},',
    '{"code": "broadage4", "selection": {"filter": "item", "values": ["1", "2", "3", "4"]}}],',
    '"response": {"format": "json-stat2", "pivot": null}}'
  ))
)

df_meta_data <- rbind(df_meta_data, t(c(
  dataset = dataset_short,
  "table_code" = dataset_long, "year" = latest_year,
  "geog_level" = "lgd",
  "dataset_url" = paste0("https://data.nisra.gov.uk/table/", dataset_long),
  "last_updated" = format(substring(updated[which(matrices == dataset_long)], 1, 10), format = "%a"),
  "email" = json_data$extension$contact$email,
  "title" = data_portal$label[which(matrices == dataset_long)],
  "note" = json_data$note
)))

categories <- unlist(json_data$dimension$broadage4$category$label)

data <- data.frame(geog_code = sort(rep(json_data$dimension$LGD2014$category$index, length(categories)))) %>%
  mutate(statistic = rep_len(categories, nrow(.)),
         VALUE = json_data$value,
         source = dataset_short) %>%
  group_by(geog_code) %>%
  mutate(perc = VALUE / sum(VALUE) * 100)

df_popage <- rbind(df_popage, data)

dataset_long <- "MYE01T010"
latest_year <- years[[which(matrices == dataset_long)]] %>% tail(1)

json_data <- jsonlite::fromJSON(
  txt = transform_URL(paste0(
    'https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/',
    dataset_subject, '/', dataset_long,
    '?query={"query": [{"code": "TLIST(A1)", "selection": {"filter": "item", "values": ["', latest_year, '"]}},',
    '{"code": "Sex", "selection": {"filter": "item", "values": ["All"]}},',
    '{"code": "broadage4", "selection": {"filter": "item", "values": ["1", "2", "3", "4"]}}],',
    '"response": {"format": "json-stat2", "pivot": null}}'
  ))
)

df_meta_data <- rbind(df_meta_data, t(c(
  dataset = dataset_short,
  "table_code" = dataset_long, "year" = latest_year,
  "geog_level" = "dea",
  "dataset_url" = paste0("https://data.nisra.gov.uk/table/", dataset_long),
  "last_updated" = format(substring(updated[which(matrices == dataset_long)], 1, 10), format = "%a"),
  "email" = json_data$extension$contact$email,
  "title" = data_portal$label[which(matrices == dataset_long)],
  "note" = json_data$note
)))

categories <- unlist(json_data$dimension$broadage4$category$label)

data <- data.frame(geog_code = sort(rep(json_data$dimension$DEA2014$category$index, length(categories)))) %>%
  mutate(statistic = rep_len(categories, nrow(.)),
         VALUE = json_data$value,
         source = dataset_short) %>%
  group_by(geog_code) %>%
  mutate(perc = VALUE / sum(VALUE) * 100) %>%
  filter(geog_code != "N92000002")

df_popage <- rbind(df_popage, data)

df_popage <- unique(df_popage)
##### population growth ####
df_popchange <- list()
dataset_short <- "PopChange"

dataset_long <- "MYE01T06"
latest_year <- years[[which(matrices == dataset_long)]] %>% tail(1)

json_data <- jsonlite::fromJSON(
  txt = transform_URL(paste0(
    'https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/',
    dataset_subject, '/', dataset_long,
    '?query={"query": [{"code": "rounded_unrounded", "selection": {"filter": "item", "values": ["Unrounded"]}}],',
    '"response": {"format": "json-stat2", "pivot": null}}'
  ))
)

df_meta_data <- rbind(df_meta_data, t(c(
  dataset = dataset_short,
  "table_code" = dataset_long, "year" = latest_year,
  "geog_level" = "lgd",
  "dataset_url" = paste0("https://data.nisra.gov.uk/table/", json_data$extension$matrix),
  "last_updated" = format(substring(json_data$updated, 1, 10), format = "%a"),
  "email" = json_data$extension$contact$email,
  "title" = json_data$label,
  "note" = json_data$note
)))

data_years <- years[[which(matrices == dataset_long)]]

data <- data.frame(geog_code = rep(json_data$dimension$LGD2014$category$index, length(data_years)),
                    VALUE = json_data$value) %>%
  mutate(statistic = sort(rep_len(data_years, nrow(.))),
         source = dataset_short)

df_popchange <- rbind(df_popchange, data)

#### Health ####
##### LE #####
###### LE by DEA ######
df_le <- list()
dataset_short <- "LE"
dataset_subject <- "8/HILEGH"

dataset_long <- "LEDEA"
latest_year <- years[[which(matrices == dataset_long)]] %>% tail(1)

json_data <- jsonlite::fromJSON(
  txt = transform_URL(paste0(
    'https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/',
    dataset_subject, '/', dataset_long,
    '?query={"query": [{"code": "TLIST(A1)", "selection": {"filter": "item", "values": ["', latest_year, '"]}}],',
    '"response": {"format": "json-stat2", "pivot": null}}'
  ))
)


df_meta_data <- rbind(df_meta_data, t(c(
  dataset = dataset_short,
  "table_code" = dataset_long, "year" = latest_year,
  "geog_level" = "dea",
  "dataset_url" = paste0("https://data.nisra.gov.uk/table/", json_data$extension$matrix),
  "last_updated" = format(substring(json_data$updated, 1, 10), format = "%a"),
  "email" = json_data$extension$contact$email,
  "title" = json_data$label,
  "note" = json_data$note
)))

categories <- unlist(json_data$dimension$GENDER$category$label)

data <- data.frame(geog_code = sort(rep(json_data$dimension$DEA2014$category$index, length(categories)))) %>%
  mutate(statistic = rep_len(categories, nrow(.)),
         VALUE = json_data$value,
         source = dataset_short)

df_le <- rbind(df_le, data)
###### LE by LGD ######
dataset_long <- "LELGD"
latest_year <- years[[which(matrices == dataset_long)]] %>% tail(1)

json_data <- jsonlite::fromJSON(
  txt = transform_URL(paste0(
    'https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/',
    dataset_subject, '/', dataset_long,
    '?query={"query": [{"code": "TLIST(A1)", "selection": {"filter": "item", "values": ["', latest_year, '"]}}],',
    '"response": {"format": "json-stat2", "pivot": null}}'
  ))
)

df_meta_data <- rbind(df_meta_data, t(c(
  dataset = dataset_short,
  "table_code" = dataset_long, "year" = latest_year,
  "geog_level" = "lgd",
  "dataset_url" = paste0("https://data.nisra.gov.uk/table/", json_data$extension$matrix),
  "last_updated" = format(substring(json_data$updated, 1, 10), format = "%a"),
  "email" = json_data$extension$contact$email,
  "title" = json_data$label,
  "note" = json_data$note
)))

data <- data.frame(geog_code = sort(rep(json_data$dimension$LGD2014$category$index, length(categories)))) %>%
  mutate(statistic = rep_len(categories, nrow(.)),
         VALUE = json_data$value,
         source = dataset_short)

df_le <- unique(rbind(df_le, data))


##### Happiness #####

dataset_subject <- "96/PW"

dataset_long <- "WBPERSWLGD"
latest_year <- years[[which(matrices == dataset_long)]] %>% tail(1)

dataset_short <- "wellbeing"

json_data <- jsonlite::fromJSON(
  txt = transform_URL(paste0(
    'https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/',
    dataset_subject, '/', dataset_long,
    '?query={"query": [{"code": "TLIST(A1)", "selection": {"filter": "item", "values": ["', latest_year, '"]}},',
    '{"code": "STATISTIC", "selection": {"filter": "item", "values": ["WBLIFE", "WBHAP"]}}],',
    '"response": {"format": "json-stat2", "pivot": null}}'
  ))
)

df_meta_data <- rbind(df_meta_data, t(c(
  dataset = dataset_short,
  "table_code" = dataset_long, "year" = latest_year,
  "geog_level" = "lgd",
  "dataset_url" = paste0("https://data.nisra.gov.uk/table/", json_data$extension$matrix),
  "last_updated" = format(substring(json_data$updated, 1, 10), format = "%a"),
  "email" = json_data$extension$contact$email,
  "title" = json_data$label,
  "note" = json_data$note
)))

categories <- factor(json_data$dimension$STATISTIC$category$index,
                     levels = json_data$dimension$STATISTIC$category$index)

data <- data.frame(geog_code = rep(json_data$dimension$LGD2014$category$index, length(categories))) %>%
  mutate(STATISTIC = sort(rep_len(categories, nrow(.))),
         VALUE = json_data$value)


dataset_long <- "WBPERSWOTHR"
latest_year <- years[[which(matrices == dataset_long)]] %>% tail(1)

json_data <- jsonlite::fromJSON(
  txt = transform_URL(paste0(
    'https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/',
    dataset_subject, '/', dataset_long,
    '?query={"query": [{"code": "TLIST(A1)", "selection": {"filter": "item", "values": ["', latest_year, '"]}},',
    '{"code": "STATISTIC", "selection": {"filter": "item", "values": ["WBLIFE", "WBHAP"]}},',
    '{"code": "OTHRCAT", "selection": {"filter": "item", "values": ["N92000002"]}}],',
    '"response": {"format": "json-stat2", "pivot": null}}'
  ))
)

data_ni <- data.frame(geog_code = "N92000002",
                       STATISTIC = json_data$dimension$STATISTIC$category$index,
                       VALUE = json_data$value)

data_both = rbind(data, data_ni)

df_happy = data_both %>% filter(STATISTIC == "WBHAP") %>% 
  mutate(source = "Happy") %>% select(geog_code, VALUE, source)

df_satisfy = data_both %>% filter(STATISTIC == "WBLIFE") %>% 
  mutate(source = "Satisfy") %>% select(geog_code, VALUE, source)




##### Loneliness #####

dataset_subject <- "96/LONEL"

dataset_long <- "WBLONLGD"
latest_year <- years[[which(matrices == dataset_long)]] %>% tail(1)

dataset_short <- "lonely"

json_data <- jsonlite::fromJSON(
  txt = transform_URL(paste0(
    'https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/',
    dataset_subject, '/', dataset_long,
    '?query={"query": [{"code": "TLIST(A1)", "selection": {"filter": "item", "values": ["', latest_year, '"]}},',
    '{"code": "STATISTIC", "selection": {"filter": "item", "values": ["WBLON"]}}],',
    '"response": {"format": "json-stat2", "pivot": null}}'
  ))
)

df_meta_data <- rbind(df_meta_data, t(c(
  dataset = dataset_short,
  "table_code" = dataset_long, "year" = latest_year,
  "geog_level" = "lgd",
  "dataset_url" = paste0("https://data.nisra.gov.uk/table/", json_data$extension$matrix),
  "last_updated" = format(substring(json_data$updated, 1, 10), format = "%a"),
  "email" = json_data$extension$contact$email,
  "title" = json_data$label,
  "note" = json_data$note
)))

categories <- factor(json_data$dimension$STATISTIC$category$index,
                     levels = json_data$dimension$STATISTIC$category$index)

data <- data.frame(geog_code = rep(json_data$dimension$LGD2014$category$index, length(categories))) %>%
  mutate(STATISTIC = sort(rep_len(categories, nrow(.))),
         VALUE = json_data$value)


dataset_long <- "WBLONOTHR"
latest_year <- years[[which(matrices == dataset_long)]] %>% tail(1)

json_data <- jsonlite::fromJSON(
  txt = transform_URL(paste0(
    'https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/',
    dataset_subject, '/', dataset_long,
    '?query={"query": [{"code": "TLIST(A1)", "selection": {"filter": "item", "values": ["', latest_year, '"]}},',
    '{"code": "STATISTIC", "selection": {"filter": "item", "values": ["WBLON"]}},',
    '{"code": "OTHRCAT", "selection": {"filter": "item", "values": ["N92000002"]}}],',
    '"response": {"format": "json-stat2", "pivot": null}}'
  ))
)

data_ni <- data.frame(geog_code = "N92000002",
                      STATISTIC = json_data$dimension$STATISTIC$category$index,
                      VALUE = json_data$value)

data_both = rbind(data, data_ni)

df_lonely = data_both %>% 
  mutate(source = "Lonely") %>% select(geog_code, VALUE, source)




##### Hospital attendance #####
##### number and top reason
df_admissions_all <- list()
df_admissions_top <- list()

dataset_subject <- "70/HAS"

dataset_long <- "ADMITDEA"
latest_year <- years[[which(matrices == dataset_long)]] %>% tail(1)

dataset_short <- "Admiss"

json_data <- jsonlite::fromJSON(
  txt = transform_URL(paste0(
    'https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/',
    dataset_subject, '/', dataset_long,
    '?query={"query": [{"code": "TLIST(A1)", "selection": {"filter": "item", "values": ["', latest_year, '"]}}],',
    '"response": {"format": "json-stat2", "pivot": null}}'
  ))
)

df_meta_data <- rbind(df_meta_data, t(c(
  dataset = dataset_short,
  "table_code" = dataset_long, "year" = latest_year,
  "geog_level" = "dea",
  "dataset_url" = paste0("https://data.nisra.gov.uk/table/", json_data$extension$matrix),
  "last_updated" = format(substring(json_data$updated, 1, 10), format = "%a"),
  "email" = json_data$extension$contact$email,
  "title" = json_data$label,
  "note" = json_data$note
)))

pdiag <- json_data$dimension$PDIAG$category$index
reason <- unlist(json_data$dimension$PDIAG$category$label)

data <- data.frame(geog_code = sort(rep(json_data$dimension$DEA2014$category$index, length(pdiag))),
                   VALUE = json_data$value) %>%
  mutate(PDIAG = rep_len(pdiag, nrow(.)),
         reason = rep_len(reason, nrow(.)),
         source = dataset_short)


data_all <- data %>%
  filter(PDIAG == "All") %>%
  select(geog_code, VALUE) %>%
  mutate(source = dataset_short)

data_top <- data %>%
  filter(PDIAG != "All") %>%
  group_by(geog_code) %>%
  slice_max(order_by = VALUE, n = 1) %>%
  select(geog_code, reason) %>%
  mutate(source = dataset_short)


df_admissions_all <- rbind(df_admissions_all, data_all)
df_admissions_top <- rbind(df_admissions_top, data_top)

##### GPs, Dentists #####

df_gps <- list()

dataset_subject <- "66/GMS"

dataset_long <- "GPPRACPATLGD"
latest_year <- years[[which(matrices == dataset_long)]] %>% tail(1)

dataset_short <- "GP"

json_data <- jsonlite::fromJSON(
  txt = transform_URL(paste0(
    'https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/',
    dataset_subject, '/', dataset_long,
    '?query={"query": [{"code": "TLIST(A1)", "selection": {"filter": "item", "values": ["', latest_year, '"]}},',
    '{"code": "STATISTIC", "selection": {"filter": "item", "values": ["PRACS", "GPS", "REGPAT", "PRACLIST"]}}],',
    '"response": {"format": "json-stat2", "pivot": null}}'
  ))
)

df_meta_data <- rbind(df_meta_data, t(c(
  dataset = dataset_short,
  "table_code" = dataset_long, "year" = latest_year,
  "geog_level" = "lgd",
  "dataset_url" = paste0("https://data.nisra.gov.uk/table/", json_data$extension$matrix),
  "last_updated" = format(substring(json_data$updated, 1, 10), format = "%a"),
  "email" = json_data$extension$contact$email,
  "title" = json_data$label,
  "note" = json_data$note
)))

categories <- factor(json_data$dimension$STATISTIC$category$index,
                     levels = json_data$dimension$STATISTIC$category$index)

data <- data.frame(geog_code = rep(json_data$dimension$LGD2014$category$index, length(categories)),
                    VALUE = json_data$value) %>%
  mutate(statistic = sort(rep_len(categories, nrow(.))),
         source = dataset_short)

df_gps <- rbind(df_gps, data)

df_dental <- list()
dataset_short <- "DEN"
dataset_subject <- "66/GDS"

dataset_long <- "FPSGDSDSDEA"
latest_year <- years[[which(matrices == dataset_long)]] %>% tail(1)

json_data <- jsonlite::fromJSON(
  txt = transform_URL(paste0(
    'https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/',
    dataset_subject, '/', dataset_long,
    '?query={"query": [{"code": "TLIST(A1)", "selection": {"filter": "item", "values": ["', latest_year, '"]}}],',
    '"response": {"format": "json-stat2", "pivot": null}}'
  ))
)


df_meta_data <- rbind(df_meta_data, t(c(
  dataset = dataset_short,
  "table_code" = dataset_long, "year" = latest_year,
  "geog_level" = "dea",
  "dataset_url" = paste0("https://data.nisra.gov.uk/table/", json_data$extension$matrix),
  "last_updated" = format(substring(json_data$updated, 1, 10), format = "%a"),
  "email" = json_data$extension$contact$email,
  "title" = json_data$label,
  "note" = json_data$note
)))

categories <- factor(json_data$dimension$STATISTIC$category$index,
                     levels = json_data$dimension$STATISTIC$category$index)

data <- data.frame(geog_code = rep(json_data$dimension$DEA2014$category$index, length(categories))) %>%
  mutate(statistic = sort(rep_len(categories, nrow(.))),
         VALUE = json_data$value,
         source = dataset_short)

df_dental <- rbind(df_dental, data)




dataset_long <- "FPSGDSDSLGD"
latest_year <- years[[which(matrices == dataset_long)]] %>% tail(1)

json_data <- jsonlite::fromJSON(
  txt = transform_URL(paste0(
    'https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/',
    dataset_subject, '/', dataset_long,
    '?query={"query": [{"code": "TLIST(A1)", "selection": {"filter": "item", "values": ["', latest_year, '"]}}],',
    '"response": {"format": "json-stat2", "pivot": null}}'
  ))
)

df_meta_data <- rbind(df_meta_data, t(c(
  dataset = dataset_short,
  "table_code" = dataset_long, "year" = latest_year,
  "geog_level" = "lgd",
  "dataset_url" = paste0("https://data.nisra.gov.uk/table/", json_data$extension$matrix),
  "last_updated" = format(substring(json_data$updated, 1, 10), format = "%a"),
  "email" = json_data$extension$contact$email,
  "title" = json_data$label,
  "note" = json_data$note
)))

categories <- factor(json_data$dimension$STATISTIC$category$index,
                     levels = json_data$dimension$STATISTIC$category$index)

data <- data.frame(geog_code = rep(json_data$dimension$LGD2014$category$index, length(categories))) %>%
  mutate(statistic = sort(rep_len(categories, nrow(.))),
         VALUE = json_data$value,
         source = dataset_short)

df_dental <- rbind(df_dental, data)

dataset_short <- "DEN_REG"

dataset_long <- "FPSGDSDRLGD"
latest_year <- years[[which(matrices == dataset_long)]] %>% tail(1)

json_data <- jsonlite::fromJSON(
  txt = transform_URL(paste0(
    'https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/',
    dataset_subject, '/', dataset_long,
    '?query={"query": [{"code": "TLIST(A1)", "selection": {"filter": "item", "values": ["', latest_year, '"]}},',
    '{"code": "Age", "selection": {"filter": "item", "values": ["All"]}}],',
    '"response": {"format": "json-stat2", "pivot": null}}'
  ))
)

df_meta_data <- rbind(df_meta_data, t(c(
  dataset = dataset_short,
  "table_code" = dataset_long, "year" = latest_year,
  "geog_level" = "lgd",
  "dataset_url" = paste0("https://data.nisra.gov.uk/table/", json_data$extension$matrix),
  "last_updated" = format(substring(json_data$updated, 1, 10), format = "%a"),
  "email" = json_data$extension$contact$email,
  "title" = json_data$label,
  "note" = json_data$note
)))

data <- data.frame(geog_code = json_data$dimension$LGD2014$category$index,
                    statistic = json_data$dimension$STATISTIC$category$index,
                    VALUE = json_data$value,
                    source = dataset_short)

df_dental <- rbind(df_dental, data)


dataset_long <- "FPSGDSDRDEA"
latest_year <- years[[which(matrices == dataset_long)]] %>% tail(1)

json_data <- jsonlite::fromJSON(
  txt = transform_URL(paste0(
    'https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/',
    dataset_subject, '/', dataset_long,
    '?query={"query": [{"code": "TLIST(A1)", "selection": {"filter": "item", "values": ["', latest_year, '"]}},',
    '{"code": "Age", "selection": {"filter": "item", "values": ["All"]}}],',
    '"response": {"format": "json-stat2", "pivot": null}}'
  ))
)

df_meta_data <- rbind(df_meta_data, t(c(
  dataset = dataset_short,
  "table_code" = dataset_long, "year" = latest_year,
  "geog_level" = "dea",
  "dataset_url" = paste0("https://data.nisra.gov.uk/table/", json_data$extension$matrix),
  "last_updated" = format(substring(json_data$updated, 1, 10), format = "%a"),
  "email" = json_data$extension$contact$email,
  "title" = json_data$label,
  "note" = json_data$note
)))

data <- data.frame(geog_code = json_data$dimension$DEA2014$category$index,
                   statistic = json_data$dimension$STATISTIC$category$index,
                   VALUE = json_data$value,
                   source = dataset_short)

df_dental <- rbind(df_dental, data)

#### Work ####

##### LMR #####
df_lmr <- list()
dataset_short <- "LMS"
dataset_subject <- "79/LMS"

dataset_long <- "LMSLGD"
latest_year <- years[[which(matrices == dataset_long)]] %>% tail(1)

json_data <- jsonlite::fromJSON(
  txt = transform_URL(paste0(
    'https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/',
    dataset_subject, '/', dataset_long,
    '?query={"query": [{"code": "TLIST(A1)", "selection": {"filter": "item", "values": ["', latest_year, '"]}},',
    '{"code": "STATISTIC", "selection": {"filter": "item", "values": ["EMPN", "EMPR", "UNEMPR", "INACTR"]}}],',
    '"response": {"format": "json-stat2", "pivot": null}}'
  ))
)

df_meta_data <- rbind(df_meta_data, t(c(
  dataset = dataset_short,
  "table_code" = dataset_long, "year" = latest_year,
  "geog_level" = "lgd",
  "dataset_url" = paste0("https://data.nisra.gov.uk/table/", json_data$extension$matrix),
  "last_updated" = format(substring(json_data$updated, 1, 10), format = "%a"),
  "email" = json_data$extension$contact$email,
  "title" = json_data$label,
  "note" = json_data$note
)))

categories <- factor(json_data$dimension$STATISTIC$category$index,
                     levels = json_data$dimension$STATISTIC$category$index)

data <- data.frame(geog_code = rep(json_data$dimension$LGD2014$category$index, length(categories))) %>%
  mutate(statistic = sort(rep_len(categories, nrow(.))),
         VALUE = json_data$value,
         source = dataset_short)

df_lmr <- rbind(df_lmr, data)

df_lmr_perc = df_lmr  %>% filter(statistic != "EMPN") %>% rename(perc = VALUE) %>% mutate(VALUE = NA)
df_lmr_value = df_lmr %>% filter(statistic == "EMPN")

##### ASHE #####
df_ashe <- list()
dataset_short <- "ASHE"

dataset_subject <- "85/EARNINGS"

dataset_long <- "GAPLGD"
latest_year <- years[[which(matrices == dataset_long)]] %>% tail(1)

json_data <- jsonlite::fromJSON(
  txt = transform_URL(paste0(
    'https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/',
    dataset_subject, '/', dataset_long,
    '?query={"query": [{"code": "TLIST(A1)", "selection": {"filter": "item", "values": ["', latest_year, '"]}},',
    '{"code": "STATISTIC", "selection": {"filter": "item", "values": ["Median"]}},',
    '{"code": "Sex", "selection": {"filter": "item", "values": ["All"]}},',
    '{"code": "WP", "selection": {"filter": "item", "values": ["All"]}}],',
    '"response": {"format": "json-stat2", "pivot": null}}'
  ))
)


df_meta_data <- rbind(df_meta_data, t(c(
  dataset = dataset_short,
  "table_code" = dataset_long, "year" = latest_year,
  "geog_level" = "lgd",
  "dataset_url" = paste0("https://data.nisra.gov.uk/table/", json_data$extension$matrix),
  "last_updated" = format(substring(json_data$updated, 1, 10), format = "%a"),
  "email" = json_data$extension$contact$email,
  "title" = json_data$label,
  "note" = json_data$note
)))

data <- data.frame(geog_code = json_data$dimension$LGD2014$category$index,
                    VALUE = json_data$value,
                    source = dataset_short)

df_ashe <- rbind(df_ashe, data)


dataset_short <- "ASHE_weekly"
dataset_subject <- "85/EARNINGS"

dataset_long <- "GHWPLGD"
latest_year <- years[[which(matrices == dataset_long)]] %>% tail(1)

json_data <- jsonlite::fromJSON(
  txt = transform_URL(paste0(
    'https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/',
    dataset_subject, '/', dataset_long,
    '?query={"query": [{"code": "TLIST(A1)", "selection": {"filter": "item", "values": ["', latest_year, '"]}},',
    '{"code": "STATISTIC", "selection": {"filter": "item", "values": ["Median"]}},',
    '{"code": "Sex", "selection": {"filter": "item", "values": ["All"]}},',
    '{"code": "WP", "selection": {"filter": "item", "values": ["All"]}},',
    '{"code": "PR", "selection": {"filter": "item", "values": ["Wkly"]}}],',
    '"response": {"format": "json-stat2", "pivot": null}}'
  ))
)


df_meta_data <- rbind(df_meta_data, t(c(
  dataset = dataset_short,
  "table_code" = dataset_long, "year" = latest_year,
  "geog_level" = "lgd",
  "dataset_url" = paste0("https://data.nisra.gov.uk/table/", json_data$extension$matrix),
  "last_updated" = format(substring(json_data$updated, 1, 10), format = "%a"),
  "email" = json_data$extension$contact$email,
  "title" = json_data$label,
  "note" = json_data$note
)))

data <- data.frame(geog_code = json_data$dimension$LGD2014$category$index,
                   VALUE = json_data$value,
                   source = dataset_short)

df_ashe <- rbind(df_ashe, data)


##### Industry #####
df_indust <- list()
dataset_short <- "BRES"
dataset_subject <- "12/BRES"

dataset_long <- "BRESHEADLGD"
latest_year <- years[[which(matrices == dataset_long)]] %>% tail(1)

json_data <- jsonlite::fromJSON(
  txt = transform_URL(paste0(
    'https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/',
    dataset_subject, '/', dataset_long,
    '?query={"query": [{"code": "TLIST(A1)", "selection": {"filter": "item", "values": ["', latest_year, '"]}},',
    '{"code": "GENWP", "selection": {"filter": "item", "values": ["All"]}},',
    '{"code": "HEADLINE", "selection": {"filter": "item", "values": ["Construction", "Manufacturing", "Services", "Other"]}}],',
    '"response": {"format": "json-stat2", "pivot": null}}'
  ))
)

df_meta_data <- rbind(df_meta_data, t(c(
  dataset = dataset_short,
  "table_code" = dataset_long, "year" = latest_year,
  "geog_level" = "lgd",
  "dataset_url" = paste0("https://data.nisra.gov.uk/table/", json_data$extension$matrix),
  "last_updated" = format(substring(json_data$updated, 1, 10), format = "%a"),
  "email" = json_data$extension$contact$email,
  "title" = json_data$label,
  "note" = json_data$note
)))

categories <- factor(json_data$dimension$HEADLINE$category$index,
                     levels = json_data$dimension$HEADLINE$category$index)

data <- data.frame(geog_code = sort(rep(json_data$dimension$LGD2014$category$index, length(categories)))) %>%
  mutate(statistic = rep_len(categories, nrow(.)),
         VALUE = json_data$value,
         source = dataset_short) %>%
  group_by(geog_code) %>%
  mutate(perc = VALUE / sum(VALUE) * 100)


df_indust <- rbind(df_indust, data)


##### Benefits #####
df_bs <- list()
dataset_short <- "BS"
dataset_subject <- "92/BEN"

dataset_long <- "BSDEA"
latest_year <- years[[which(matrices == dataset_long)]] %>% tail(1)

json_data <- jsonlite::fromJSON(
  txt = transform_URL(paste0(
    'https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/',
    dataset_subject, '/', dataset_long,
    '?query={"query": [{"code": "TLIST(A1)", "selection": {"filter": "item", "values": ["', latest_year, '"]}}],',
    '"response": {"format": "json-stat2", "pivot": null}}'
  ))
)

df_meta_data <- rbind(df_meta_data, t(c(
  dataset = dataset_short,
  "table_code" = dataset_long, "year" = latest_year,
  "geog_level" = "dea",
  "dataset_url" = paste0("https://data.nisra.gov.uk/table/", json_data$extension$matrix),
  "last_updated" = format(substring(json_data$updated, 1, 10), format = "%a"),
  "email" = json_data$extension$contact$email,
  "title" = json_data$label,
  "note" = json_data$note
)))

categories <- factor(json_data$dimension$STATISTIC$category$index,
                    levels = json_data$dimension$STATISTIC$category$index)

data <- data.frame(geog_code = rep(json_data$dimension$DEA2014$category$index, length(categories))) %>%
  mutate(statistic = sort(rep_len(categories, nrow(.))),
         VALUE = json_data$value,
         source = dataset_short)

df_bs <- rbind(df_bs, data)

dataset_long <- "BSLGD"
latest_year <- years[[which(matrices == dataset_long)]] %>% tail(1)

json_data <- jsonlite::fromJSON(
  txt = transform_URL(paste0(
    'https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/',
    dataset_subject, '/', dataset_long,
    '?query={"query": [{"code": "TLIST(A1)", "selection": {"filter": "item", "values": ["', latest_year, '"]}}],',
    '"response": {"format": "json-stat2", "pivot": null}}'
  ))
)

df_meta_data <- rbind(df_meta_data, t(c(
  dataset = dataset_short,
  "table_code" = dataset_long, "year" = latest_year,
  "geog_level" = "lgd",
  "dataset_url" = paste0("https://data.nisra.gov.uk/table/", json_data$extension$matrix),
  "last_updated" = format(substring(json_data$updated, 1, 10), format = "%a"),
  "email" = json_data$extension$contact$email,
  "title" = json_data$label,
  "note" = json_data$note
)))

categories <- factor(json_data$dimension$STATISTIC$category$index,
                     levels = json_data$dimension$STATISTIC$category$index)

data <- data.frame(geog_code = rep(json_data$dimension$LGD2014$category$index, length(categories))) %>%
  mutate(statistic = sort(rep_len(categories, nrow(.))),
         VALUE = json_data$value,
         source = dataset_short)

df_bs <- rbind(df_bs, data)

dataset_long <- "BSSDZ"
latest_year <- years[[which(matrices == dataset_long)]] %>% tail(1)

json_data <- jsonlite::fromJSON(
  txt = transform_URL(paste0(
    'https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/',
    dataset_subject, '/', dataset_long,
    '?query={"query": [{"code": "TLIST(A1)", "selection": {"filter": "item", "values": ["', latest_year, '"]}}],',
    '"response": {"format": "json-stat2", "pivot": null}}'
  ))
)


df_meta_data <- rbind(df_meta_data, t(c(
  dataset = dataset_short,
  "table_code" = dataset_long, "year" = latest_year,
  "geog_level" = "sdz",
  "dataset_url" = paste0("https://data.nisra.gov.uk/table/", json_data$extension$matrix),
  "last_updated" = format(substring(json_data$updated, 1, 10), format = "%a"),
  "email" = json_data$extension$contact$email,
  "title" = json_data$label,
  "note" = json_data$note
)))

categories <- factor(json_data$dimension$STATISTIC$category$index,
                     levels = json_data$dimension$STATISTIC$category$index)

data <- data.frame(geog_code = rep(json_data$dimension$SDZ2021$category$index, length(categories))) %>%
  mutate(statistic = sort(rep_len(categories, nrow(.))),
         VALUE = json_data$value,
         source = dataset_short)

df_bs <- rbind(df_bs, data)


dataset_long <- "BSDZ"
latest_year <- years[[which(matrices == dataset_long)]] %>% tail(1)

json_data <- jsonlite::fromJSON(
  txt = transform_URL(paste0(
    'https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/',
    dataset_subject, '/', dataset_long,
    '?query={"query": [{"code": "TLIST(A1)", "selection": {"filter": "item", "values": ["', latest_year, '"]}}],',
    '"response": {"format": "json-stat2", "pivot": null}}'
  ))
)

df_meta_data <- rbind(df_meta_data, t(c(
  dataset = dataset_short,
  "table_code" = dataset_long, "year" = latest_year,
  "geog_level" = "dz",
  "dataset_url" = paste0("https://data.nisra.gov.uk/table/", json_data$extension$matrix),
  "last_updated" = format(substring(json_data$updated, 1, 10), format = "%a"),
  "email" = json_data$extension$contact$email,
  "title" = json_data$label,
  "note" = json_data$note
)))

categories <- factor(json_data$dimension$STATISTIC$category$index,
                     levels = json_data$dimension$STATISTIC$category$index)

data <- data.frame(geog_code = rep(json_data$dimension$DZ2021$category$index, length(categories))) %>%
  mutate(statistic = sort(rep_len(categories, nrow(.))),
         VALUE = json_data$value,
         source = dataset_short)

df_bs <- rbind(df_bs, data)

#### Education ####

##### Schools #####
##### FSME #####


df_school_value <- list()
df_school_perc <- list()
dataset_short <- "Primary"
dataset_subject <- "76/SCEN"

dataset_long <- "DESCPDEA"
latest_year <- years[[which(matrices == dataset_long)]] %>% tail(1)

json_data <- jsonlite::fromJSON(
  txt = transform_URL(paste0(
    'https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/',
    dataset_subject, '/', dataset_long,
    '?query={"query": [{"code": "TLIST(A1)", "selection": {"filter": "item", "values": ["', latest_year, '"]}},',
    '{"code": "STATISTIC", "selection": {"filter": "item", "values": ["FSME", "All", "SENNonStatemented", "SENStatement"]}}],',
    '"response": {"format": "json-stat2", "pivot": null}}'
  ))
)

latest_year <- as.character(json_data$dimension$`TLIST(A1)`$category$label %>% tail(1))
df_meta_data <- rbind(df_meta_data, t(c(
  dataset = dataset_short,
  "table_code" = dataset_long, 
  "year" = latest_year,
  "geog_level" = "dea",
  "dataset_url" = paste0("https://data.nisra.gov.uk/table/", json_data$extension$matrix),
  "last_updated" = format(substring(json_data$updated, 1, 10), format = "%a"),
  "email" = json_data$extension$contact$email,
  "title" = json_data$label,
  "note" = json_data$note
)))

categories <- factor(json_data$dimension$STATISTIC$category$index,
                     levels = json_data$dimension$STATISTIC$category$index)

data <- data.frame(geog_code = rep(json_data$dimension$DEA2014$category$index, length(categories))) %>%
  mutate(statistic = sort(rep_len(categories, nrow(.))),
         VALUE = json_data$value,
         source = dataset_short) %>%
  group_by(geog_code) 
  

data_value <- data %>%
  select(geog_code, statistic, VALUE, source)


df_school_value <- rbind(df_school_value, data_value)


dataset_long <- "DESCPLGD"
latest_year <- years[[which(matrices == dataset_long)]] %>% tail(1)

json_data <- jsonlite::fromJSON(
  txt = transform_URL(paste0(
    'https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/',
    dataset_subject, '/', dataset_long,
    '?query={"query": [{"code": "TLIST(A1)", "selection": {"filter": "item", "values": ["', latest_year, '"]}},',
    '{"code": "STATISTIC", "selection": {"filter": "item", "values": ["FSME", "All", "SENNonStatemented", "SENStatement"]}}],',
    '"response": {"format": "json-stat2", "pivot": null}}'
  ))
)

df_meta_data <- rbind(df_meta_data, t(c(
  dataset = dataset_short,
  "table_code" = dataset_long, "year" = latest_year,
  "geog_level" = "lgd",
  "dataset_url" = paste0("https://data.nisra.gov.uk/table/", json_data$extension$matrix),
  "last_updated" = format(substring(json_data$updated, 1, 10), format = "%a"),
  "email" = json_data$extension$contact$email,
  "title" = json_data$label,
  "note" = json_data$note
)))

categories <- factor(json_data$dimension$STATISTIC$category$index,
                     levels = json_data$dimension$STATISTIC$category$index)

data <- data.frame(geog_code = rep(json_data$dimension$LGD2014$category$index, length(categories))) %>%
  mutate(statistic = sort(rep_len(categories, nrow(.))),
         VALUE = json_data$value,
         source = dataset_short) %>%
  group_by(geog_code) 

data_value <- data %>%
  select(geog_code, statistic, VALUE, source)


df_school_value <- rbind(df_school_value, data_value)


dataset_short <- "PostPrimary"

dataset_long <- "DESCPPDEA"
latest_year <- years[[which(matrices == dataset_long)]] %>% tail(1)

json_data <- jsonlite::fromJSON(
  txt = transform_URL(paste0(
    'https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/',
    dataset_subject, '/', dataset_long,
    '?query={"query": [{"code": "TLIST(A1)", "selection": {"filter": "item", "values": ["', latest_year, '"]}},',
    '{"code": "STATISTIC", "selection": {"filter": "item", "values": ["FSME", "All", "SENNonStatemented", "SENStatement"]}}],',
    '"response": {"format": "json-stat2", "pivot": null}}'
  ))
)

df_meta_data <- rbind(df_meta_data, t(c(
  dataset = dataset_short,
  "table_code" = dataset_long, "year" = latest_year,
  "geog_level" = "dea",
  "dataset_url" = paste0("https://data.nisra.gov.uk/table/", json_data$extension$matrix),
  "last_updated" = format(substring(json_data$updated, 1, 10), format = "%a"),
  "email" = json_data$extension$contact$email,
  "title" = json_data$label,
  "note" = json_data$note
)))

categories <- factor(json_data$dimension$STATISTIC$category$index,
                     levels = json_data$dimension$STATISTIC$category$index)

data <- data.frame(geog_code = rep(json_data$dimension$DEA2014$category$index, length(categories))) %>%
  mutate(statistic = sort(rep_len(categories, nrow(.))),
         VALUE = json_data$value,
         source = dataset_short) %>%
  group_by(geog_code) 

data_value <- data %>%
  select(geog_code, statistic, VALUE, source)

df_school_value <- rbind(df_school_value, data_value)


dataset_long <- "DESCPPLGD"
latest_year <- years[[which(matrices == dataset_long)]] %>% tail(1)

json_data <- jsonlite::fromJSON(
  txt = transform_URL(paste0(
    'https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/',
    dataset_subject, '/', dataset_long,
    '?query={"query": [{"code": "TLIST(A1)", "selection": {"filter": "item", "values": ["', latest_year, '"]}},',
    '{"code": "STATISTIC", "selection": {"filter": "item", "values": ["FSME", "All", "SENNonStatemented", "SENStatement"]}}],',
    '"response": {"format": "json-stat2", "pivot": null}}'
  ))
)

df_meta_data <- rbind(df_meta_data, t(c(
  dataset = dataset_short,
  "table_code" = dataset_long, "year" = latest_year,
  "geog_level" = "lgd",
  "dataset_url" = paste0("https://data.nisra.gov.uk/table/", json_data$extension$matrix),
  "last_updated" = format(substring(json_data$updated, 1, 10), format = "%a"),
  "email" = json_data$extension$contact$email,
  "title" = json_data$label,
  "note" = json_data$note
)))

categories <- factor(json_data$dimension$STATISTIC$category$index,
                     levels = json_data$dimension$STATISTIC$category$index)

data <- data.frame(geog_code = rep(json_data$dimension$LGD2014$category$index, length(categories))) %>%
  mutate(statistic = sort(rep_len(categories, nrow(.))),
         VALUE = json_data$value,
         source = dataset_short) %>%
  group_by(geog_code) 

data_value <- data %>%
  select(geog_code, statistic, VALUE, source)


df_school_value <- rbind(df_school_value, data_value)


##### SEN ####

dataset_short <- "SEN"
dataset_subject <- "76/SCEN"

dataset_long <- "DESCSDEA"
latest_year <- years[[which(matrices == dataset_long)]] %>% tail(1)

json_data <- jsonlite::fromJSON(
  txt = transform_URL(paste0(
    'https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/',
    dataset_subject, '/', dataset_long,
    '?query={"query": [{"code": "TLIST(A1)", "selection": {"filter": "item", "values": ["', latest_year, '"]}},',
    '{"code": "STATISTIC", "selection": {"filter": "item", "values": ["SENNonStatemented", "SENStatement"]}}],',
    '"response": {"format": "json-stat2", "pivot": null}}'
  ))
)

df_meta_data <- rbind(df_meta_data, t(c(
  dataset = dataset_short,
  "table_code" = dataset_long, "year" = latest_year,
  "geog_level" = "dea",
  "dataset_url" = paste0("https://data.nisra.gov.uk/table/", json_data$extension$matrix),
  "last_updated" = format(substring(json_data$updated, 1, 10), format = "%a"),
  "email" = json_data$extension$contact$email,
  "title" = json_data$label,
  "note" = json_data$note
)))

categories <- factor(json_data$dimension$STATISTIC$category$index,
                     levels = json_data$dimension$STATISTIC$category$index)

data <- data.frame(geog_code = rep(json_data$dimension$DEA2014$category$index, length(categories))) %>%
  mutate(statistic = sort(rep_len(categories, nrow(.))),
         VALUE = json_data$value,
         source = dataset_short)

df_school_value <- unique(rbind(df_school_value, data))

dataset_long <- "DESCSLGD"
latest_year <- years[[which(matrices == dataset_long)]] %>% tail(1)

json_data <- jsonlite::fromJSON(
  txt = transform_URL(paste0(
    'https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/',
    dataset_subject, '/', dataset_long,
    '?query={"query": [{"code": "TLIST(A1)", "selection": {"filter": "item", "values": ["', latest_year, '"]}},',
    '{"code": "STATISTIC", "selection": {"filter": "item", "values": ["All", "SENNonStatemented", "SENStatement"]}}],',
    '"response": {"format": "json-stat2", "pivot": null}}'
  ))
)

df_meta_data <- rbind(df_meta_data, t(c(
  dataset = dataset_short,
  "table_code" = dataset_long, "year" = latest_year,
  "geog_level" = "lgd",
  "dataset_url" = paste0("https://data.nisra.gov.uk/table/", json_data$extension$matrix),
  "last_updated" = format(substring(json_data$updated, 1, 10), format = "%a"),
  "email" = json_data$extension$contact$email,
  "title" = json_data$label,
  "note" = json_data$note
)))

categories <- factor(json_data$dimension$STATISTIC$category$index,
                     levels = json_data$dimension$STATISTIC$category$index)

data <- data.frame(geog_code = rep(json_data$dimension$LGD2014$category$index, length(categories))) %>%
  mutate(statistic = sort(rep_len(categories, nrow(.))),
         VALUE = json_data$value,
         source = dataset_short)

df_school_value <- unique(rbind(df_school_value, data))


df_school_FSME <- df_school_value %>% 
  filter(statistic %in% c('FSME', 'All')) %>% 
  filter(source != "SEN") %>%  
  group_by(geog_code, source) %>%
  mutate(perc = VALUE / VALUE[statistic == "All"] *100) 
  
df_school_SEN = df_school_value %>%
  filter(statistic != 'FSME') %>% replace(is.na(.), 0) %>% 
  mutate(statistic = case_when(statistic %in% c("SENNonStatemented", "SENStatement") ~ 'SEN',
                   TRUE ~ statistic)) %>%
  group_by(geog_code, statistic) %>% summarise(VALUE = sum(VALUE)) %>% 
  mutate(perc = VALUE / VALUE[statistic == "All"] *100) %>% 
  filter(statistic != "All") %>%  
  mutate(source = "AllSchools") 


df_school_values <- unique(rbind(df_school_FSME %>% select(-perc), df_school_SEN %>% select(-perc)))

df_school_perc <- unique(rbind(df_school_FSME, df_school_SEN))







##### Pupil / teacher ratio #####
df_school_classsize <- list()
dataset_short <- "ClassSize"
dataset_subject <- "76/SWF"

dataset_long <- "DETNPTRLGD"
latest_year <- years[[which(matrices == dataset_long)]] %>% tail(1)

json_data <- jsonlite::fromJSON(
  txt = transform_URL(paste0(
    'https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/',
    dataset_subject, '/', dataset_long,
    '?query={"query": [{"code": "TLIST(A1)", "selection": {"filter": "item", "values": ["', latest_year, '"]}},',
    '{"code": "TNschooltype", "selection": {"filter": "item", "values": ["All"]}}],',
    '"response": {"format": "json-stat2", "pivot": null}}'
  ))
)

df_meta_data <- rbind(df_meta_data, t(c(
  dataset = dataset_short,
  "table_code" = dataset_long, "year" = latest_year,
  "geog_level" = "lgd",
  "dataset_url" = paste0("https://data.nisra.gov.uk/table/", json_data$extension$matrix),
  "last_updated" = format(substring(json_data$updated, 1, 10), format = "%a"),
  "email" = json_data$extension$contact$email,
  "title" = json_data$label,
  "note" = json_data$note
)))

data <- data.frame(geog_code = json_data$dimension$LGD2014$category$index,
                    VALUE = json_data$value,
                    source = dataset_short)

df_school_classsize <- rbind(df_school_classsize, data)
##### GCSEs #####
df_school_attainment <- list()
dataset_short <- "Attainment"
dataset_subject <- "76/SL"

dataset_long <- "DESLSALGD"
latest_year <- years[[which(matrices == dataset_long)]] %>% tail(1)

json_data <- jsonlite::fromJSON(
  txt = transform_URL(paste0(
    'https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/',
    dataset_subject, '/', dataset_long,
    '?query={"query": [{"code": "TLIST(A1)", "selection": {"filter": "item", "values": ["', latest_year, '"]}},',
    '{"code": "FSME", "selection": {"filter": "item", "values": ["All"]}},',
    '{"code": "STATISTIC", "selection": {"filter": "item", "values": ["fivegcseatocincengmathpct"]}}],',
    '"response": {"format": "json-stat2", "pivot": null}}'
  ))
)

df_meta_data <- rbind(df_meta_data, t(c(
  dataset = dataset_short,
  "table_code" = dataset_long, "year" = latest_year,
  "geog_level" = "lgd",
  "dataset_url" = paste0("https://data.nisra.gov.uk/table/", json_data$extension$matrix),
  "last_updated" = format(substring(json_data$updated, 1, 10), format = "%a"),
  "email" = json_data$extension$contact$email,
  "title" = json_data$label,
  "note" = json_data$note
)))

data <- data.frame(geog_code = json_data$dimension$LGD2014$category$index,
                   VALUE = json_data$value,
                   source = dataset_short)


df_school_attainment <- rbind(df_school_attainment, data)

dataset_long <- "DESLSADEA"
latest_year <- years[[which(matrices == dataset_long)]] %>% tail(1)

json_data <- jsonlite::fromJSON(
  txt = transform_URL(paste0(
    'https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/',
    dataset_subject, '/', dataset_long,
    '?query={"query": [{"code": "TLIST(A1)", "selection": {"filter": "item", "values": ["', latest_year, '"]}},',
    '{"code": "FSME", "selection": {"filter": "item", "values": ["All"]}},',
    '{"code": "STATISTIC", "selection": {"filter": "item", "values": ["fivegcseatocincengmathpct"]}}],',
    '"response": {"format": "json-stat2", "pivot": null}}'
  ))
)

df_meta_data <- rbind(df_meta_data, t(c(
  dataset = dataset_short,
  "table_code" = dataset_long, "year" = latest_year,
  "geog_level" = "dea",
  "dataset_url" = paste0("https://data.nisra.gov.uk/table/", json_data$extension$matrix),
  "last_updated" = format(substring(json_data$updated, 1, 10), format = "%a"),
  "email" = json_data$extension$contact$email,
  "title" = json_data$label,
  "note" = json_data$note
)))

data <- data.frame(geog_code = json_data$dimension$DEA2014$category$index,
                   VALUE = json_data$value,
                   source = dataset_short)


df_school_attainment <- rbind(df_school_attainment, data)
##### Colleges and Universities #####

df_FEHE <- list()
dataset_short <- "FE"
dataset_subject <- "77/FES"

dataset_long <- "FEENROLLGD"
latest_year <- years[[which(matrices == dataset_long)]] %>% tail(1)

json_data <- jsonlite::fromJSON(
  txt = transform_URL(paste0(
    'https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/',
    dataset_subject, '/', dataset_long,
    '?query={"query": [{"code": "TLIST(A1)", "selection": {"filter": "item", "values": ["', latest_year, '"]}}],',
    '"response": {"format": "json-stat2", "pivot": null}}'
  ))
)

df_meta_data <- rbind(df_meta_data, t(c(
  dataset = dataset_short,
  "table_code" = dataset_long, "year" = latest_year,
  "geog_level" = "lgd",
  "dataset_url" = paste0("https://data.nisra.gov.uk/table/", json_data$extension$matrix),
  "last_updated" = format(substring(json_data$updated, 1, 10), format = "%a"),
  "email" = json_data$extension$contact$email,
  "title" = json_data$label,
  "note" = json_data$note
)))

data <- data.frame(geog_code = json_data$dimension$LGD2014$category$index,
                   VALUE = json_data$value,
                   source = dataset_short)

df_FEHE <- rbind(df_FEHE, data)

dataset_long <- "FEENROLDEA"
latest_year <- years[[which(matrices == dataset_long)]] %>% tail(1)

json_data <- jsonlite::fromJSON(
  txt = transform_URL(paste0(
    'https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/',
    dataset_subject, '/', dataset_long,
    '?query={"query": [{"code": "TLIST(A1)", "selection": {"filter": "item", "values": ["', latest_year, '"]}}],',
    '"response": {"format": "json-stat2", "pivot": null}}'
  ))
)

df_meta_data <- rbind(df_meta_data, t(c(
  dataset = dataset_short,
  "table_code" = dataset_long, "year" = latest_year,
  "geog_level" = "dea",
  "dataset_url" = paste0("https://data.nisra.gov.uk/table/", json_data$extension$matrix),
  "last_updated" = format(substring(json_data$updated, 1, 10), format = "%a"),
  "email" = json_data$extension$contact$email,
  "title" = json_data$label,
  "note" = json_data$note
)))

data <- data.frame(geog_code = json_data$dimension$DEA2014$category$index,
                   VALUE = json_data$value,
                   source = dataset_short)

df_FEHE <- rbind(df_FEHE, data)

dataset_short <- "HE"
dataset_subject <- "77/HES"

dataset_long <- "HEENROLLGD"
latest_year <- years[[which(matrices == dataset_long)]] %>% tail(1)

json_data <- jsonlite::fromJSON(
  txt = transform_URL(paste0(
    'https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/',
    dataset_subject, '/', dataset_long,
    '?query={"query": [{"code": "TLIST(A1)", "selection": {"filter": "item", "values": ["', latest_year, '"]}}],',
    '"response": {"format": "json-stat2", "pivot": null}}'
  ))
)

df_meta_data <- rbind(df_meta_data, t(c(
  dataset = dataset_short,
  "table_code" = dataset_long, "year" = latest_year,
  "geog_level" = "lgd",
  "dataset_url" = paste0("https://data.nisra.gov.uk/table/", json_data$extension$matrix),
  "last_updated" = format(substring(json_data$updated, 1, 10), format = "%a"),
  "email" = json_data$extension$contact$email,
  "title" = json_data$label,
  "note" = json_data$note
)))

data <- data.frame(geog_code = json_data$dimension$LGD2014$category$index,
                   VALUE = json_data$value,
                   source = dataset_short)

df_FEHE <- rbind(df_FEHE, data)

dataset_long <- "HEENROLDEA"
latest_year <- years[[which(matrices == dataset_long)]] %>% tail(1)

json_data <- jsonlite::fromJSON(
  txt = transform_URL(paste0(
    'https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/',
    dataset_subject, '/', dataset_long,
    '?query={"query": [{"code": "TLIST(A1)", "selection": {"filter": "item", "values": ["', latest_year, '"]}}],',
    '"response": {"format": "json-stat2", "pivot": null}}'
  ))
)

df_meta_data <- rbind(df_meta_data, t(c(
  dataset = dataset_short,
  "table_code" = dataset_long, "year" = latest_year,
  "geog_level" = "dea",
  "dataset_url" = paste0("https://data.nisra.gov.uk/table/", json_data$extension$matrix),
  "last_updated" = format(substring(json_data$updated, 1, 10), format = "%a"),
  "email" = json_data$extension$contact$email,
  "title" = json_data$label,
  "note" = json_data$note
)))

data <- data.frame(geog_code = json_data$dimension$DEA2014$category$index,
                   VALUE = json_data$value,
                   source = dataset_short)

df_FEHE <- rbind(df_FEHE, data)


##### Destination #####

df_school_destination <- list()
dataset_short <- "Destination"
dataset_subject <- "76/SL"

dataset_long <- "DESLSDDEA"
latest_year <- years[[which(matrices == dataset_long)]] %>% tail(1)

json_data <- jsonlite::fromJSON(
  txt = transform_URL(paste0(
    'https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/',
    dataset_subject, '/', dataset_long,
    '?query={"query": [{"code": "TLIST(A1)", "selection": {"filter": "item", "values": ["', latest_year, '"]}},',
    '{"code": "STATISTIC", "selection": {"filter": "item", "values": ["destHEpct", "destFEpct", "destEmploypct", "destTrainpct", "destUnempUnkpct"]}}],',
    '"response": {"format": "json-stat2", "pivot": null}}'
  ))
)

df_meta_data <- rbind(df_meta_data, t(c(
  dataset = dataset_short,
  "table_code" = dataset_long, "year" = latest_year,
  "geog_level" = "dea",
  "dataset_url" = paste0("https://data.nisra.gov.uk/table/", json_data$extension$matrix),
  "last_updated" = format(substring(json_data$updated, 1, 10), format = "%a"),
  "email" = json_data$extension$contact$email,
  "title" = json_data$label,
  "note" = json_data$note
)))

categories <- factor(json_data$dimension$STATISTIC$category$index,
                     levels = json_data$dimension$STATISTIC$category$index)

data <- data.frame(geog_code = rep(json_data$dimension$DEA2014$category$index, length(categories))) %>%
  mutate(statistic = sort(rep_len(categories, nrow(.))),
         VALUE = json_data$value,
         source = dataset_short)

df_school_destination <- unique(rbind(df_school_destination, data))

  
dataset_long <- "DESLSDLGD"
latest_year <- years[[which(matrices == dataset_long)]] %>% tail(1)

json_data <- jsonlite::fromJSON(
  txt = transform_URL(paste0(
    'https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/',
    dataset_subject, '/', dataset_long,
    '?query={"query": [{"code": "TLIST(A1)", "selection": {"filter": "item", "values": ["', latest_year, '"]}},',
    '{"code": "STATISTIC", "selection": {"filter": "item", "values": ["destHEpct", "destFEpct", "destEmploypct", "destTrainpct", "destUnempUnkpct"]}},',
    '{"code": "FSME", "selection": {"filter": "item", "values":["All"]}}],',
    '"response": {"format": "json-stat2", "pivot": null}}'
  ))
)

df_meta_data <- rbind(df_meta_data, t(c(
  dataset = dataset_short,
  "table_code" = dataset_long, "year" = latest_year,
  "geog_level" = "lgd",
  "dataset_url" = paste0("https://data.nisra.gov.uk/table/", json_data$extension$matrix),
  "last_updated" = format(substring(json_data$updated, 1, 10), format = "%a"),
  "email" = json_data$extension$contact$email,
  "title" = json_data$label,
  "note" = json_data$note
)))

categories <- factor(json_data$dimension$STATISTIC$category$index,
                     levels = json_data$dimension$STATISTIC$category$index)

data <- data.frame(geog_code = rep(json_data$dimension$LGD2014$category$index, length(categories))) %>%
  mutate(statistic = sort(rep_len(categories, nrow(.))),
         VALUE = json_data$value,
         source = dataset_short)

df_school_destination <- unique(rbind(df_school_destination, data))
df_school_destination_perc = df_school_destination %>% rename(perc = VALUE) %>% mutate(VALUE = NA)





#### Environment ####
df_env <- list()
df_env_perc <- list()

##### Concern #####

dataset_short <- "Env_concern"
dataset_subject <- "82/PA"

dataset_long <- "CHSCONCERNLGD"
latest_year <- years[[which(matrices == dataset_long)]] %>% tail(1)

json_data <- jsonlite::fromJSON(
  txt = transform_URL(paste0(
    'https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/',
    dataset_subject, '/', dataset_long,
    '?query={"query": [{"code": "TLIST(A1)", "selection": {"filter": "item", "values": ["', latest_year, '"]}},',
    '{"code": "STATISTIC", "selection": {"filter": "item", "values": ["CONCERNENVI", "NOTCONCERNENVI"]}}],',
    '"response": {"format": "json-stat2", "pivot": null}}'
  ))
)


df_meta_data <- rbind(df_meta_data, t(c(
  dataset = dataset_short,
  "table_code" = dataset_long,
  "year" = latest_year,
  "geog_level" = "lgd",
  "dataset_url" = paste0("https://data.nisra.gov.uk/table/", dataset_long),
  "last_updated" = format(substring(updated[which(matrices == dataset_long)], 1, 10), format = "%a"),
  "email" = json_data$extension$contact$email,
  "title" = data_portal$label[which(matrices == dataset_long)],
  "note" = json_data$note
)))

categories <- factor(json_data$dimension$STATISTIC$category$index,
                     levels = json_data$dimension$STATISTIC$category$index)

data <- data.frame(geog_code = rep(json_data$dimension$LGD2014$category$index, length(categories))) %>%
  mutate(statistic = sort(rep_len(categories, nrow(.))),
         VALUE = json_data$value,
         source = dataset_short) %>%
  mutate(perc = VALUE )

df_env_perc <- rbind(df_env_perc, data)




dataset_short <- "Env_waste"
dataset_subject <- "82/W"

##### waste #####
dataset_long <- "WASTELGD"
latest_year <- years[[which(matrices == dataset_long)]] %>% tail(1)

json_data <- jsonlite::fromJSON(
  txt = transform_URL(paste0(
    'https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/',
    dataset_subject, '/', dataset_long,
    '?query={"query": [{"code": "TLIST(A1)", "selection": {"filter": "item", "values": ["', latest_year, '"]}},',
    '{"code": "STATISTIC", "selection": {"filter": "item", "values": ["LACMWR","LACMWL","LACMWER"]}}],',
    '"response": {"format": "json-stat2", "pivot": null}}'
  ))
)


df_meta_data <- rbind(df_meta_data, t(c(
  dataset = dataset_short,
  "table_code" = dataset_long,
  "year" = latest_year,
  "geog_level" = "lgd",
  "dataset_url" = paste0("https://data.nisra.gov.uk/table/", dataset_long),
  "last_updated" = format(substring(updated[which(matrices == dataset_long)], 1, 10), format = "%a"),
  "email" = json_data$extension$contact$email,
  "title" = data_portal$label[which(matrices == dataset_long)],
  "note" = json_data$note
)))

categories <- factor(json_data$dimension$STATISTIC$category$index,
                     levels = json_data$dimension$STATISTIC$category$index)

data <- data.frame(geog_code = rep(json_data$dimension$LGD2014$category$index, length(categories))) %>%
  mutate(statistic = sort(rep_len(categories, nrow(.))),
         VALUE = json_data$value,
         source = dataset_short,
         perc = VALUE)

df_env_perc <- rbind(df_env_perc, data)




##### GHG #####

dataset_short <- "Env_ghg"
dataset_subject <- "82/GHG"

dataset_long <- "GHGALL"
latest_year <- years[[which(matrices == dataset_long)]] %>% tail(1)

json_data <- jsonlite::fromJSON(
  txt = transform_URL(paste0(
    'https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/',
    dataset_subject, '/', dataset_long,
    '?query={"query": [{"code": "TLIST(A1)", "selection": {"filter": "item", "values": ["', latest_year, '"]}},',
    '{"code": "GHGSECTOR", "selection": {"filter": "item", "values": ["GTALL"]}}],',
    '"response": {"format": "json-stat2", "pivot": null}}'
  ))
)


df_meta_data <- rbind(df_meta_data, t(c(
  dataset = dataset_short,
  "table_code" = dataset_long,
  "year" = latest_year,
  "geog_level" = "lgd",
  "dataset_url" = paste0("https://data.nisra.gov.uk/table/", dataset_long),
  "last_updated" = format(substring(updated[which(matrices == dataset_long)], 1, 10), format = "%a"),
  "email" = json_data$extension$contact$email,
  "title" = data_portal$label[which(matrices == dataset_long)],
  "note" = json_data$note
)))

categories <- factor(json_data$dimension$STATISTIC$category$index,
                     levels = json_data$dimension$STATISTIC$category$index)

data <- data.frame(geog_code = rep(json_data$dimension$LGD2014$category$index, length(categories))) %>%
  mutate(statistic = sort(rep_len(categories, nrow(.))),
         VALUE = json_data$value,
         source = dataset_short)

df_env <- rbind(df_env, data)


##### active travel #####

dataset_short <- "Env_active"
dataset_subject <- "91/ACTTRV"

dataset_long <- "JMWCPTLGD"
latest_year <- years[[which(matrices == dataset_long)]] %>% tail(1)

json_data <- jsonlite::fromJSON(
  txt = transform_URL(paste0(
    'https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/',
    dataset_subject, '/', dataset_long,
    '?query={"query": [{"code": "TLIST(A1)", "selection": {"filter": "item", "values": ["', latest_year, '"]}},',
    '{"code": "STATISTIC", "selection": {"filter": "item", "values": ["JWCPT"]}}],',
    '"response": {"format": "json-stat2", "pivot": null}}'
  ))
)


df_meta_data <- rbind(df_meta_data, t(c(
  dataset = dataset_short,
  "table_code" = dataset_long,
  "year" = latest_year,
  "geog_level" = "lgd",
  "dataset_url" = paste0("https://data.nisra.gov.uk/table/", dataset_long),
  "last_updated" = format(substring(updated[which(matrices == dataset_long)], 1, 10), format = "%a"),
  "email" = json_data$extension$contact$email,
  "title" = data_portal$label[which(matrices == dataset_long)],
  "note" = json_data$note
)))

categories <- factor(json_data$dimension$STATISTIC$category$index,
                     levels = json_data$dimension$STATISTIC$category$index)

data <- data.frame(geog_code = rep(json_data$dimension$LGD2014$category$index, length(categories))) %>%
  mutate(statistic = sort(rep_len(categories, nrow(.))),
         VALUE = json_data$value,
         source = dataset_short)

df_env <- rbind(df_env, data)


#### Crime ####
##### PSNI recorded crime ####

df_crime <- list()
dataset_short <- "crime"
dataset_subject <- "67/PRC"

dataset_long <- "PRCDEA"
latest_year <- years[[which(matrices == dataset_long)]] %>% tail(1)

json_data <- jsonlite::fromJSON(
  txt = transform_URL(paste0(
    'https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/',
    dataset_subject, '/', dataset_long,
    '?query={"query": [{"code": "TLIST(A1)", "selection": {"filter": "item", "values": ["', latest_year, '"]}},',
    '{"code": "crmclass", "selection": {"filter": "item", "values": ["All"]}}],',
    '"response": {"format": "json-stat2", "pivot": null}}'
  ))
)

df_meta_data <- rbind(df_meta_data, t(c(
  dataset = dataset_short,
  "table_code" = dataset_long, "year" = latest_year,
  "geog_level" = "dea",
  "dataset_url" = paste0("https://data.nisra.gov.uk/table/", json_data$extension$matrix),
  "last_updated" = format(substring(json_data$updated, 1, 10), format = "%a"),
  "email" = json_data$extension$contact$email,
  "title" = json_data$label,
  "note" = json_data$note
)))

categories <- factor(json_data$dimension$STATISTIC$category$index,
                     levels = json_data$dimension$STATISTIC$category$index)

data <- data.frame(geog_code = rep(json_data$dimension$DEA2014$category$index, length(categories))) %>%
  mutate(statistic = sort(rep_len(categories, nrow(.))),
         VALUE = json_data$value,
         source = dataset_short)

df_crime <- rbind(df_crime, data)

dataset_long <- "PRCLGD"
latest_year <- years[[which(matrices == dataset_long)]] %>% tail(1)

json_data <- jsonlite::fromJSON(
  txt = transform_URL(paste0(
    'https://ws-data.nisra.gov.uk/public/api.restful/PxStat.Data.Cube_API.PxAPIv1/en/',
    dataset_subject, '/', dataset_long,
    '?query={"query": [{"code": "TLIST(A1)", "selection": {"filter": "item", "values": ["', latest_year, '"]}},',
    '{"code": "crmclass", "selection": {"filter": "item", "values": ["All"]}}],',
    '"response": {"format": "json-stat2", "pivot": null}}'
    
  ))
)

df_meta_data <- rbind(df_meta_data, t(c(
  dataset = dataset_short,
  "table_code" = dataset_long, "year" = latest_year,
  "geog_level" = "lgd",
  "dataset_url" = paste0("https://data.nisra.gov.uk/table/", json_data$extension$matrix),
  "last_updated" = format(substring(json_data$updated, 1, 10), format = "%a"),
  "email" = json_data$extension$contact$email,
  "title" = json_data$label,
  "note" = json_data$note
)))

categories <- factor(json_data$dimension$STATISTIC$category$index,
                     levels = json_data$dimension$STATISTIC$category$index)

data <- data.frame(geog_code = rep(json_data$dimension$LGD2014$category$index, length(categories))) %>%
  mutate(statistic = sort(rep_len(categories, nrow(.))),
         VALUE = json_data$value,
         source = dataset_short)

df_crime <- unique(rbind(df_crime, data))


#### Bind rows ####

df_dp_all_values <- unique(bind_rows(
  rbind(
    df_le, df_dental, df_gps, df_lmr_value, df_bs,
    #df_school_destination, 
    df_popchange, df_school_values, 
    df_env,
    df_crime
  ),
  rbind(
    df_satisfy, df_happy, df_lonely, 
    df_admissions_all, df_ashe,
    df_school_classsize, df_school_attainment, df_FEHE, df_pop
  )
))


df_dp_all_text <- bind_rows(df_admissions_top)

df_dp_all_perc <- unique(rbind(df_lmr_perc, df_indust, df_school_perc, df_popage, df_school_destination_perc, df_env_perc))


