import gql from 'graphql-tag';
/** The source of the asset */
export var AssetsSource;
(function (AssetsSource) {
    /** Assets from file columns and item's files gallery */
    AssetsSource["All"] = "all";
    /** Assets only from file columns */
    AssetsSource["Columns"] = "columns";
    /** Assets only from item's files gallery */
    AssetsSource["Gallery"] = "gallery";
})(AssetsSource || (AssetsSource = {}));
/** The board attributes available. */
export var BoardAttributes;
(function (BoardAttributes) {
    /** Object that contains available Video conferences on the board. */
    BoardAttributes["Communication"] = "communication";
    /** Board description. */
    BoardAttributes["Description"] = "description";
    /** Board name. */
    BoardAttributes["Name"] = "name";
})(BoardAttributes || (BoardAttributes = {}));
/** The board kinds available. */
export var BoardKind;
(function (BoardKind) {
    /** Private boards. */
    BoardKind["Private"] = "private";
    /** Public boards. */
    BoardKind["Public"] = "public";
    /** Shareable boards. */
    BoardKind["Share"] = "share";
})(BoardKind || (BoardKind = {}));
/** The board object types. */
export var BoardObjectType;
(function (BoardObjectType) {
    /** Parent Board. */
    BoardObjectType["Board"] = "board";
    /** Custom Object. */
    BoardObjectType["CustomObject"] = "custom_object";
    /** Document. */
    BoardObjectType["Document"] = "document";
    /** Sub Items Board. */
    BoardObjectType["SubItemsBoard"] = "sub_items_board";
})(BoardObjectType || (BoardObjectType = {}));
/** The board subscriber kind. */
export var BoardSubscriberKind;
(function (BoardSubscriberKind) {
    /** Board owner. */
    BoardSubscriberKind["Owner"] = "owner";
    /** Board subscriber. */
    BoardSubscriberKind["Subscriber"] = "subscriber";
})(BoardSubscriberKind || (BoardSubscriberKind = {}));
/** Options to order by. */
export var BoardsOrderBy;
(function (BoardsOrderBy) {
    /** The rank order of the board creation time (desc). */
    BoardsOrderBy["CreatedAt"] = "created_at";
    /** The last time the user making the request used the board (desc). */
    BoardsOrderBy["UsedAt"] = "used_at";
})(BoardsOrderBy || (BoardsOrderBy = {}));
/** The property name of the column to be changed. */
export var ColumnProperty;
(function (ColumnProperty) {
    /** the column description. */
    ColumnProperty["Description"] = "description";
    /** the column title. */
    ColumnProperty["Title"] = "title";
})(ColumnProperty || (ColumnProperty = {}));
/** The columns to create. */
export var ColumnType;
(function (ColumnType) {
    /** Number items according to their order in the group/board */
    ColumnType["AutoNumber"] = "auto_number";
    /** Connect data from other boards */
    ColumnType["BoardRelation"] = "board_relation";
    /** Perform actions on items by clicking a button */
    ColumnType["Button"] = "button";
    /** Check off items and see what's done at a glance */
    ColumnType["Checkbox"] = "checkbox";
    /** Manage a design system using a color palette */
    ColumnType["ColorPicker"] = "color_picker";
    /** Choose a country */
    ColumnType["Country"] = "country";
    /** Add the item's creator and creation date automatically */
    ColumnType["CreationLog"] = "creation_log";
    /** Add dates like deadlines to ensure you never drop the ball */
    ColumnType["Date"] = "date";
    /** Set up dependencies between items in the board */
    ColumnType["Dependency"] = "dependency";
    /** Instantly add collaborative rich text editor */
    ColumnType["Doc"] = "doc";
    /** Create a dropdown list of options */
    ColumnType["Dropdown"] = "dropdown";
    /** Email team members and clients directly from your board */
    ColumnType["Email"] = "email";
    /** Add files & docs to your item */
    ColumnType["File"] = "file";
    /** Use functions to manipulate data across multiple columns */
    ColumnType["Formula"] = "formula";
    ColumnType["Group"] = "group";
    /** Add times to manage and schedule tasks, shifts and more */
    ColumnType["Hour"] = "hour";
    /** Integration is really cool... */
    ColumnType["Integration"] = "integration";
    /** Show all item's assignees */
    ColumnType["ItemAssignees"] = "item_assignees";
    /** Show a unique ID for each item */
    ColumnType["ItemId"] = "item_id";
    /** Add the person that last updated the item and the date */
    ColumnType["LastUpdated"] = "last_updated";
    /** Simply hyperlink to any website */
    ColumnType["Link"] = "link";
    /** Place multiple locations on a geographic map */
    ColumnType["Location"] = "location";
    /** Add large amounts of text without changing column width */
    ColumnType["LongText"] = "long_text";
    /** Show and edit columns' data from connected boards */
    ColumnType["Mirror"] = "mirror";
    /** Name is really cool... */
    ColumnType["Name"] = "name";
    /** Add revenue, costs, time estimations and more */
    ColumnType["Numbers"] = "numbers";
    /** Assign people to improve team work */
    ColumnType["People"] = "people";
    /** Call your contacts directly from monday.com */
    ColumnType["Phone"] = "phone";
    /** Show progress by combining status columns in a battery */
    ColumnType["Progress"] = "progress";
    /** Rate or rank anything visually */
    ColumnType["Rating"] = "rating";
    /** Get an instant overview of where things stand */
    ColumnType["Status"] = "status";
    /** Use the subtasks column to create another level of tasks */
    ColumnType["Subtasks"] = "subtasks";
    /** Add tags to categorize items across multiple boards */
    ColumnType["Tags"] = "tags";
    /** Assign a full team to an item  */
    ColumnType["Team"] = "team";
    /** Add textual information e.g. addresses, names or keywords */
    ColumnType["Text"] = "text";
    /** Easily track time spent on each item, group, and board */
    ColumnType["TimeTracking"] = "time_tracking";
    /** Visualize your item’s duration, with a start and end date */
    ColumnType["Timeline"] = "timeline";
    /** Unsupported column type */
    ColumnType["Unsupported"] = "unsupported";
    /** Vote on an item e.g. pick a new feature or a favorite lunch place */
    ColumnType["Vote"] = "vote";
    /** Select the week on which each item should be completed */
    ColumnType["Week"] = "week";
    /** Keep track of the time anywhere in the world */
    ColumnType["WorldClock"] = "world_clock";
})(ColumnType || (ColumnType = {}));
/** The board duplicate types available. */
export var DuplicateBoardType;
(function (DuplicateBoardType) {
    /** Duplicate board with structure and items. */
    DuplicateBoardType["DuplicateBoardWithPulses"] = "duplicate_board_with_pulses";
    /** Duplicate board with structure, items and updates. */
    DuplicateBoardType["DuplicateBoardWithPulsesAndUpdates"] = "duplicate_board_with_pulses_and_updates";
    /** Duplicate board with structure. */
    DuplicateBoardType["DuplicateBoardWithStructure"] = "duplicate_board_with_structure";
})(DuplicateBoardType || (DuplicateBoardType = {}));
/** The type of a link value stored inside a file column */
export var FileLinkValueKind;
(function (FileLinkValueKind) {
    /** Box file */
    FileLinkValueKind["Box"] = "box";
    /** Dropbox file */
    FileLinkValueKind["Dropbox"] = "dropbox";
    /** Google Drive file */
    FileLinkValueKind["GoogleDrive"] = "google_drive";
    /** Generic link file */
    FileLinkValueKind["Link"] = "link";
    /** OneDrive file */
    FileLinkValueKind["Onedrive"] = "onedrive";
})(FileLinkValueKind || (FileLinkValueKind = {}));
/** The first day of work week */
export var FirstDayOfTheWeek;
(function (FirstDayOfTheWeek) {
    /** Monday */
    FirstDayOfTheWeek["Monday"] = "monday";
    /** Sunday */
    FirstDayOfTheWeek["Sunday"] = "sunday";
})(FirstDayOfTheWeek || (FirstDayOfTheWeek = {}));
/** One value out of a list of valid folder colors */
export var FolderColor;
(function (FolderColor) {
    /** aquamarine */
    FolderColor["Aquamarine"] = "AQUAMARINE";
    /** bright-blue */
    FolderColor["BrightBlue"] = "BRIGHT_BLUE";
    /** bright-green */
    FolderColor["BrightGreen"] = "BRIGHT_GREEN";
    /** chili-blue */
    FolderColor["ChiliBlue"] = "CHILI_BLUE";
    /** dark-orange */
    FolderColor["DarkOrange"] = "DARK_ORANGE";
    /** dark_purple */
    FolderColor["DarkPurple"] = "DARK_PURPLE";
    /** dark-red */
    FolderColor["DarkRed"] = "DARK_RED";
    /** done-green */
    FolderColor["DoneGreen"] = "DONE_GREEN";
    /** indigo */
    FolderColor["Indigo"] = "INDIGO";
    /** lipstick */
    FolderColor["Lipstick"] = "LIPSTICK";
    /** No color */
    FolderColor["Null"] = "NULL";
    /** purple */
    FolderColor["Purple"] = "PURPLE";
    /** sofia_pink */
    FolderColor["SofiaPink"] = "SOFIA_PINK";
    /** stuck-red */
    FolderColor["StuckRed"] = "STUCK_RED";
    /** sunset */
    FolderColor["Sunset"] = "SUNSET";
    /** working_orange */
    FolderColor["WorkingOrange"] = "WORKING_ORANGE";
})(FolderColor || (FolderColor = {}));
/** The group attributes available. */
export var GroupAttributes;
(function (GroupAttributes) {
    /** Group color (one of the supported colors, check the API documentation). */
    GroupAttributes["Color"] = "color";
    /** The group's position in the board. Deprecated! - replaced with relative position */
    GroupAttributes["Position"] = "position";
    /** The group's relative position after another group in the board. */
    GroupAttributes["RelativePositionAfter"] = "relative_position_after";
    /** The group's relative position before another group in the board. */
    GroupAttributes["RelativePositionBefore"] = "relative_position_before";
    /** Group title. */
    GroupAttributes["Title"] = "title";
})(GroupAttributes || (GroupAttributes = {}));
/** The direction to order the items by */
export var ItemsOrderByDirection;
(function (ItemsOrderByDirection) {
    /** Ascending order */
    ItemsOrderByDirection["Asc"] = "asc";
    /** Descending order */
    ItemsOrderByDirection["Desc"] = "desc";
})(ItemsOrderByDirection || (ItemsOrderByDirection = {}));
/** The condition between the query rules */
export var ItemsQueryOperator;
(function (ItemsQueryOperator) {
    /** Logical AND */
    ItemsQueryOperator["And"] = "and";
    /** Logical OR */
    ItemsQueryOperator["Or"] = "or";
})(ItemsQueryOperator || (ItemsQueryOperator = {}));
/** The operator to use for the value comparison */
export var ItemsQueryRuleOperator;
(function (ItemsQueryRuleOperator) {
    /** Any of the values */
    ItemsQueryRuleOperator["AnyOf"] = "any_of";
    /** Between the two values */
    ItemsQueryRuleOperator["Between"] = "between";
    /** Contains all the terms */
    ItemsQueryRuleOperator["ContainsTerms"] = "contains_terms";
    /** Contains the text */
    ItemsQueryRuleOperator["ContainsText"] = "contains_text";
    /** Ends with the value */
    ItemsQueryRuleOperator["EndsWith"] = "ends_with";
    /** Greater than the value */
    ItemsQueryRuleOperator["GreaterThan"] = "greater_than";
    /** Greater than or equal to the value */
    ItemsQueryRuleOperator["GreaterThanOrEquals"] = "greater_than_or_equals";
    /** Empty value */
    ItemsQueryRuleOperator["IsEmpty"] = "is_empty";
    /** Not empty value */
    ItemsQueryRuleOperator["IsNotEmpty"] = "is_not_empty";
    /** Lower than the value */
    ItemsQueryRuleOperator["LowerThan"] = "lower_than";
    /** Lower than or equal to the value */
    ItemsQueryRuleOperator["LowerThanOrEqual"] = "lower_than_or_equal";
    /** None of the values */
    ItemsQueryRuleOperator["NotAnyOf"] = "not_any_of";
    /** Does not contain the text */
    ItemsQueryRuleOperator["NotContainsText"] = "not_contains_text";
    /** Starts with the value */
    ItemsQueryRuleOperator["StartsWith"] = "starts_with";
    /** Within the last */
    ItemsQueryRuleOperator["WithinTheLast"] = "within_the_last";
    /** Within the next  */
    ItemsQueryRuleOperator["WithinTheNext"] = "within_the_next";
})(ItemsQueryRuleOperator || (ItemsQueryRuleOperator = {}));
/** Kind of assignee */
export var Kind;
(function (Kind) {
    /** Represents a person */
    Kind["Person"] = "person";
    /** Represents a team */
    Kind["Team"] = "team";
})(Kind || (Kind = {}));
/** The notification's target type. */
export var NotificationTargetType;
(function (NotificationTargetType) {
    /** Update */
    NotificationTargetType["Post"] = "Post";
    /** Item or Board. */
    NotificationTargetType["Project"] = "Project";
})(NotificationTargetType || (NotificationTargetType = {}));
/** Indicates where the unit symbol should be placed in a number value */
export var NumberValueUnitDirection;
(function (NumberValueUnitDirection) {
    /** The symbol is placed on the left of the number */
    NumberValueUnitDirection["Left"] = "left";
    /** The symbol is placed on the right of the number */
    NumberValueUnitDirection["Right"] = "right";
})(NumberValueUnitDirection || (NumberValueUnitDirection = {}));
/** The position relative method. */
export var PositionRelative;
(function (PositionRelative) {
    /** position after at the given entity. */
    PositionRelative["AfterAt"] = "after_at";
    /** position before at the given entity. */
    PositionRelative["BeforeAt"] = "before_at";
})(PositionRelative || (PositionRelative = {}));
/** The possible states for a board or item. */
export var State;
(function (State) {
    /** Active only (Default). */
    State["Active"] = "active";
    /** Active, Archived and Deleted. */
    State["All"] = "all";
    /** Archived only. */
    State["Archived"] = "archived";
    /** Deleted only. */
    State["Deleted"] = "deleted";
})(State || (State = {}));
/** The possibilities for a user kind. */
export var UserKind;
(function (UserKind) {
    /** All users in account. */
    UserKind["All"] = "all";
    /** Only guests. */
    UserKind["Guests"] = "guests";
    /** Only company members. */
    UserKind["NonGuests"] = "non_guests";
    /** All non pending members. */
    UserKind["NonPending"] = "non_pending";
})(UserKind || (UserKind = {}));
/** All possible API version types */
export var VersionKind;
(function (VersionKind) {
    /** Previous stable version. Migrate to current stable as soon as possible. */
    VersionKind["Deprecated"] = "deprecated";
    /** Bleeding-edge rolling version that constantly changes */
    VersionKind["Dev"] = "dev";
    /** Next version to become stable. */
    VersionKind["Preview"] = "preview";
    /** Current version. */
    VersionKind["Stable"] = "stable";
    /** No longer supported version. Migrate to current stable as soon as possible. */
    VersionKind["Unsupported"] = "unsupported";
})(VersionKind || (VersionKind = {}));
/** The webhook's target type. */
export var WebhookEventType;
(function (WebhookEventType) {
    /** Column value changed on board */
    WebhookEventType["ChangeColumnValue"] = "change_column_value";
    /** An item name changed on board */
    WebhookEventType["ChangeName"] = "change_name";
    /** Specific Column value changed on board */
    WebhookEventType["ChangeSpecificColumnValue"] = "change_specific_column_value";
    /** Status column value changed on board */
    WebhookEventType["ChangeStatusColumnValue"] = "change_status_column_value";
    /** Column value changed on board subitem */
    WebhookEventType["ChangeSubitemColumnValue"] = "change_subitem_column_value";
    /** An subitem name changed on board */
    WebhookEventType["ChangeSubitemName"] = "change_subitem_name";
    /** Column created on a board */
    WebhookEventType["CreateColumn"] = "create_column";
    /** An item was created on board */
    WebhookEventType["CreateItem"] = "create_item";
    /** A subitem was created on a board */
    WebhookEventType["CreateSubitem"] = "create_subitem";
    /** An update was posted on board subitem */
    WebhookEventType["CreateSubitemUpdate"] = "create_subitem_update";
    /** An update was posted on board item */
    WebhookEventType["CreateUpdate"] = "create_update";
    /** An update was deleted from board item */
    WebhookEventType["DeleteUpdate"] = "delete_update";
    /** An update was edited on board item */
    WebhookEventType["EditUpdate"] = "edit_update";
    /** An item was archived on a board */
    WebhookEventType["ItemArchived"] = "item_archived";
    /** An item was deleted from a board */
    WebhookEventType["ItemDeleted"] = "item_deleted";
    /** An item is moved to any group */
    WebhookEventType["ItemMovedToAnyGroup"] = "item_moved_to_any_group";
    /** An item is moved to a specific group */
    WebhookEventType["ItemMovedToSpecificGroup"] = "item_moved_to_specific_group";
    /** An item restored back to board */
    WebhookEventType["ItemRestored"] = "item_restored";
    /** A subitem is moved from one parent to another */
    WebhookEventType["MoveSubitem"] = "move_subitem";
    /** A subitem was archived on a board */
    WebhookEventType["SubitemArchived"] = "subitem_archived";
    /** A subitem was deleted from a board */
    WebhookEventType["SubitemDeleted"] = "subitem_deleted";
})(WebhookEventType || (WebhookEventType = {}));
/** The workspace kinds available. */
export var WorkspaceKind;
(function (WorkspaceKind) {
    /** Closed workspace, available to enterprise only. */
    WorkspaceKind["Closed"] = "closed";
    /** Open workspace. */
    WorkspaceKind["Open"] = "open";
})(WorkspaceKind || (WorkspaceKind = {}));
/** The workspace subscriber kind. */
export var WorkspaceSubscriberKind;
(function (WorkspaceSubscriberKind) {
    /** Workspace owner. */
    WorkspaceSubscriberKind["Owner"] = "owner";
    /** Workspace subscriber. */
    WorkspaceSubscriberKind["Subscriber"] = "subscriber";
})(WorkspaceSubscriberKind || (WorkspaceSubscriberKind = {}));
/** Options to order by. */
export var WorkspacesOrderBy;
(function (WorkspacesOrderBy) {
    /** The rank order of the workspace creation time (desc). */
    WorkspacesOrderBy["CreatedAt"] = "created_at";
})(WorkspacesOrderBy || (WorkspacesOrderBy = {}));
export const UserFieldsFragmentDoc = gql `
  fragment UserFields on User {
    id
    name
    email
  }
`;
export const GetMeDocument = gql `
  query getMe {
    me {
      ...UserFields
    }
  }
  ${UserFieldsFragmentDoc}
`;
const defaultWrapper = (action, _operationName, _operationType, variables) => action();
export function getSdk(client, withWrapper = defaultWrapper) {
    return {
        getMe(variables, requestHeaders) {
            return withWrapper((wrappedRequestHeaders) => client.request(GetMeDocument, variables, { ...requestHeaders, ...wrappedRequestHeaders }), 'getMe', 'query', variables);
        },
    };
}
