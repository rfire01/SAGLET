USE [master]
GO
/****** Object:  Database [ServerSagletModel]    Script Date: 2/14/2016 12:14:58 ******/
CREATE DATABASE [ServerSagletModel]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'ServerSagletModel', FILENAME = N'c:\Program Files\Microsoft SQL Server\MSSQL11.SQLEXPRESS\MSSQL\DATA\ServerSagletModel.mdf' , SIZE = 4160KB , MAXSIZE = UNLIMITED, FILEGROWTH = 1024KB )
 LOG ON 
( NAME = N'ServerSagletModel_log', FILENAME = N'c:\Program Files\Microsoft SQL Server\MSSQL11.SQLEXPRESS\MSSQL\DATA\ServerSagletModel_log.ldf' , SIZE = 2112KB , MAXSIZE = 2048GB , FILEGROWTH = 10%)
GO
ALTER DATABASE [ServerSagletModel] SET COMPATIBILITY_LEVEL = 110
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [ServerSagletModel].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [ServerSagletModel] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [ServerSagletModel] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [ServerSagletModel] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [ServerSagletModel] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [ServerSagletModel] SET ARITHABORT OFF 
GO
ALTER DATABASE [ServerSagletModel] SET AUTO_CLOSE ON 
GO
ALTER DATABASE [ServerSagletModel] SET AUTO_CREATE_STATISTICS ON 
GO
ALTER DATABASE [ServerSagletModel] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [ServerSagletModel] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [ServerSagletModel] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [ServerSagletModel] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [ServerSagletModel] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [ServerSagletModel] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [ServerSagletModel] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [ServerSagletModel] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [ServerSagletModel] SET  ENABLE_BROKER 
GO
ALTER DATABASE [ServerSagletModel] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [ServerSagletModel] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [ServerSagletModel] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [ServerSagletModel] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [ServerSagletModel] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [ServerSagletModel] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [ServerSagletModel] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [ServerSagletModel] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [ServerSagletModel] SET  MULTI_USER 
GO
ALTER DATABASE [ServerSagletModel] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [ServerSagletModel] SET DB_CHAINING OFF 
GO
ALTER DATABASE [ServerSagletModel] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [ServerSagletModel] SET TARGET_RECOVERY_TIME = 0 SECONDS 
GO
USE [ServerSagletModel]
GO
/****** Object:  User [ServerSagletModel]    Script Date: 2/14/2016 12:14:58 ******/
CREATE USER [ServerSagletModel] FOR LOGIN [IIS APPPOOL\DefaultAppPool] WITH DEFAULT_SCHEMA=[dbo]
GO
ALTER ROLE [db_owner] ADD MEMBER [ServerSagletModel]
GO
/****** Object:  Table [dbo].[__MigrationHistory]    Script Date: 2/14/2016 12:14:58 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[__MigrationHistory](
	[MigrationId] [nvarchar](150) NOT NULL,
	[ContextKey] [nvarchar](300) NOT NULL,
	[Model] [varbinary](max) NOT NULL,
	[ProductVersion] [nvarchar](32) NOT NULL,
 CONSTRAINT [PK_dbo.__MigrationHistory] PRIMARY KEY CLUSTERED 
(
	[MigrationId] ASC,
	[ContextKey] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[CriticalActionPoints]    Script Date: 2/14/2016 12:14:58 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CriticalActionPoints](
	[ActionID] [int] NOT NULL,
	[TabID] [int] NOT NULL,
	[Type] [int] NOT NULL,
	[Priority] [nvarchar](max) NULL,
	[Like] [bit] NULL,
	[Status] [bit] NULL,
 CONSTRAINT [PK_dbo.CriticalActionPoints] PRIMARY KEY CLUSTERED 
(
	[ActionID] ASC,
	[TabID] ASC,
	[Type] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[CriticalMsgPoints]    Script Date: 2/14/2016 12:14:58 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CriticalMsgPoints](
	[MsgID] [int] NOT NULL,
	[GroupID] [int] NOT NULL,
	[Type] [int] NOT NULL,
	[Priority] [nvarchar](max) NULL,
	[Like] [bit] NULL,
	[Status] [bit] NULL,
 CONSTRAINT [PK_dbo.CriticalMsgPoints] PRIMARY KEY CLUSTERED 
(
	[MsgID] ASC,
	[GroupID] ASC,
	[Type] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Groups]    Script Date: 2/14/2016 12:14:58 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Groups](
	[RoomID] [int] NOT NULL,
	[UsernamesAsString] [nvarchar](max) NULL,
 CONSTRAINT [PK_dbo.Groups] PRIMARY KEY CLUSTERED 
(
	[RoomID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Lines]    Script Date: 2/14/2016 12:14:58 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Lines](
	[TabID] [int] NOT NULL,
	[Lbl] [nvarchar](128) NOT NULL,
	[p1_TabID] [int] NULL,
	[p1_Lbl] [nvarchar](128) NULL,
 CONSTRAINT [PK_dbo.Lines] PRIMARY KEY CLUSTERED 
(
	[TabID] ASC,
	[Lbl] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[LinesUnbouded]    Script Date: 2/14/2016 12:14:58 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LinesUnbouded](
	[TabID] [int] NOT NULL,
	[Lbl] [nvarchar](128) NOT NULL,
	[p2_TabID] [int] NULL,
	[p2_Lbl] [nvarchar](128) NULL,
 CONSTRAINT [PK_dbo.LinesUnbouded] PRIMARY KEY CLUSTERED 
(
	[TabID] ASC,
	[Lbl] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Moderators]    Script Date: 2/14/2016 12:14:58 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Moderators](
	[Username] [nvarchar](128) NOT NULL,
 CONSTRAINT [PK_dbo.Moderators] PRIMARY KEY CLUSTERED 
(
	[Username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Points]    Script Date: 2/14/2016 12:14:58 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Points](
	[TabID] [int] NOT NULL,
	[Lbl] [nvarchar](128) NOT NULL,
	[X] [float] NOT NULL,
	[Y] [float] NOT NULL,
 CONSTRAINT [PK_dbo.Points] PRIMARY KEY CLUSTERED 
(
	[TabID] ASC,
	[Lbl] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[RoomModerators]    Script Date: 2/14/2016 12:14:58 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RoomModerators](
	[Room_ID] [int] NOT NULL,
	[Moderator_Username] [nvarchar](128) NOT NULL,
 CONSTRAINT [PK_dbo.RoomModerators] PRIMARY KEY CLUSTERED 
(
	[Room_ID] ASC,
	[Moderator_Username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Rooms]    Script Date: 2/14/2016 12:14:58 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Rooms](
	[ID] [int] NOT NULL,
	[Sync] [bit] NOT NULL,
	[LastUpdate] [datetime] NOT NULL,
	[Moderator_Username] [nvarchar](128) NULL,
 CONSTRAINT [PK_dbo.Rooms] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Shapes]    Script Date: 2/14/2016 12:14:58 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Shapes](
	[TabID] [int] NOT NULL,
	[Lbl] [nvarchar](128) NOT NULL,
	[wasRemoved] [bit] NOT NULL,
 CONSTRAINT [PK_dbo.Shapes] PRIMARY KEY CLUSTERED 
(
	[TabID] ASC,
	[Lbl] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Tabs]    Script Date: 2/14/2016 12:14:58 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Tabs](
	[ID] [int] NOT NULL,
	[GroupID] [int] NOT NULL,
 CONSTRAINT [PK_dbo.Tabs] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Users]    Script Date: 2/14/2016 12:14:58 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[Username] [nvarchar](128) NOT NULL,
 CONSTRAINT [PK_dbo.Users] PRIMARY KEY CLUSTERED 
(
	[Username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[VActions]    Script Date: 2/14/2016 12:14:58 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[VActions](
	[ID] [int] NOT NULL,
	[TabID] [int] NOT NULL,
	[TimeStamp] [datetime] NOT NULL,
	[Type] [nvarchar](max) NULL,
	[UserID] [nvarchar](128) NULL,
	[ShapeLbl] [nvarchar](128) NULL,
 CONSTRAINT [PK_dbo.VActions] PRIMARY KEY CLUSTERED 
(
	[ID] ASC,
	[TabID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[VMsgs]    Script Date: 2/14/2016 12:14:58 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[VMsgs](
	[ID] [int] NOT NULL,
	[GroupID] [int] NOT NULL,
	[UserID] [nvarchar](128) NULL,
	[TimeStamp] [datetime] NOT NULL,
	[Sentiment] [int] NOT NULL,
	[Text] [nvarchar](max) NULL,
 CONSTRAINT [PK_dbo.VMsgs] PRIMARY KEY CLUSTERED 
(
	[ID] ASC,
	[GroupID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Index [IX_ActionID_TabID]    Script Date: 2/14/2016 12:14:58 ******/
CREATE NONCLUSTERED INDEX [IX_ActionID_TabID] ON [dbo].[CriticalActionPoints]
(
	[ActionID] ASC,
	[TabID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_MsgID_GroupID]    Script Date: 2/14/2016 12:14:58 ******/
CREATE NONCLUSTERED INDEX [IX_MsgID_GroupID] ON [dbo].[CriticalMsgPoints]
(
	[MsgID] ASC,
	[GroupID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_RoomID]    Script Date: 2/14/2016 12:14:58 ******/
CREATE NONCLUSTERED INDEX [IX_RoomID] ON [dbo].[Groups]
(
	[RoomID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [IX_p1_TabID_p1_Lbl]    Script Date: 2/14/2016 12:14:59 ******/
CREATE NONCLUSTERED INDEX [IX_p1_TabID_p1_Lbl] ON [dbo].[Lines]
(
	[p1_TabID] ASC,
	[p1_Lbl] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [IX_TabID_Lbl]    Script Date: 2/14/2016 12:14:59 ******/
CREATE NONCLUSTERED INDEX [IX_TabID_Lbl] ON [dbo].[Lines]
(
	[TabID] ASC,
	[Lbl] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [IX_p2_TabID_p2_Lbl]    Script Date: 2/14/2016 12:14:59 ******/
CREATE NONCLUSTERED INDEX [IX_p2_TabID_p2_Lbl] ON [dbo].[LinesUnbouded]
(
	[p2_TabID] ASC,
	[p2_Lbl] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [IX_TabID_Lbl]    Script Date: 2/14/2016 12:14:59 ******/
CREATE NONCLUSTERED INDEX [IX_TabID_Lbl] ON [dbo].[LinesUnbouded]
(
	[TabID] ASC,
	[Lbl] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [IX_TabID_Lbl]    Script Date: 2/14/2016 12:14:59 ******/
CREATE NONCLUSTERED INDEX [IX_TabID_Lbl] ON [dbo].[Points]
(
	[TabID] ASC,
	[Lbl] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [IX_Moderator_Username]    Script Date: 2/14/2016 12:14:59 ******/
CREATE NONCLUSTERED INDEX [IX_Moderator_Username] ON [dbo].[RoomModerators]
(
	[Moderator_Username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_Room_ID]    Script Date: 2/14/2016 12:14:59 ******/
CREATE NONCLUSTERED INDEX [IX_Room_ID] ON [dbo].[RoomModerators]
(
	[Room_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [IX_Moderator_Username]    Script Date: 2/14/2016 12:14:59 ******/
CREATE NONCLUSTERED INDEX [IX_Moderator_Username] ON [dbo].[Rooms]
(
	[Moderator_Username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_TabID]    Script Date: 2/14/2016 12:14:59 ******/
CREATE NONCLUSTERED INDEX [IX_TabID] ON [dbo].[Shapes]
(
	[TabID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_GroupID]    Script Date: 2/14/2016 12:14:59 ******/
CREATE NONCLUSTERED INDEX [IX_GroupID] ON [dbo].[Tabs]
(
	[GroupID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_TabID]    Script Date: 2/14/2016 12:14:59 ******/
CREATE NONCLUSTERED INDEX [IX_TabID] ON [dbo].[VActions]
(
	[TabID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [IX_TabID_ShapeLbl]    Script Date: 2/14/2016 12:14:59 ******/
CREATE NONCLUSTERED INDEX [IX_TabID_ShapeLbl] ON [dbo].[VActions]
(
	[TabID] ASC,
	[ShapeLbl] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [IX_UserID]    Script Date: 2/14/2016 12:14:59 ******/
CREATE NONCLUSTERED INDEX [IX_UserID] ON [dbo].[VActions]
(
	[UserID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_GroupID]    Script Date: 2/14/2016 12:14:59 ******/
CREATE NONCLUSTERED INDEX [IX_GroupID] ON [dbo].[VMsgs]
(
	[GroupID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [IX_UserID]    Script Date: 2/14/2016 12:14:59 ******/
CREATE NONCLUSTERED INDEX [IX_UserID] ON [dbo].[VMsgs]
(
	[UserID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[CriticalActionPoints]  WITH CHECK ADD  CONSTRAINT [FK_dbo.CriticalActionPoints_dbo.VActions_ActionID_TabID] FOREIGN KEY([ActionID], [TabID])
REFERENCES [dbo].[VActions] ([ID], [TabID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[CriticalActionPoints] CHECK CONSTRAINT [FK_dbo.CriticalActionPoints_dbo.VActions_ActionID_TabID]
GO
ALTER TABLE [dbo].[CriticalMsgPoints]  WITH CHECK ADD  CONSTRAINT [FK_dbo.CriticalMsgPoints_dbo.VMsgs_MsgID_GroupID] FOREIGN KEY([MsgID], [GroupID])
REFERENCES [dbo].[VMsgs] ([ID], [GroupID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[CriticalMsgPoints] CHECK CONSTRAINT [FK_dbo.CriticalMsgPoints_dbo.VMsgs_MsgID_GroupID]
GO
ALTER TABLE [dbo].[Groups]  WITH CHECK ADD  CONSTRAINT [FK_dbo.Groups_dbo.Rooms_RoomID] FOREIGN KEY([RoomID])
REFERENCES [dbo].[Rooms] ([ID])
GO
ALTER TABLE [dbo].[Groups] CHECK CONSTRAINT [FK_dbo.Groups_dbo.Rooms_RoomID]
GO
ALTER TABLE [dbo].[Lines]  WITH CHECK ADD  CONSTRAINT [FK_dbo.Lines_dbo.Points_p1_TabID_p1_Lbl] FOREIGN KEY([p1_TabID], [p1_Lbl])
REFERENCES [dbo].[Points] ([TabID], [Lbl])
GO
ALTER TABLE [dbo].[Lines] CHECK CONSTRAINT [FK_dbo.Lines_dbo.Points_p1_TabID_p1_Lbl]
GO
ALTER TABLE [dbo].[Lines]  WITH CHECK ADD  CONSTRAINT [FK_dbo.Lines_dbo.Shapes_TabID_Lbl] FOREIGN KEY([TabID], [Lbl])
REFERENCES [dbo].[Shapes] ([TabID], [Lbl])
GO
ALTER TABLE [dbo].[Lines] CHECK CONSTRAINT [FK_dbo.Lines_dbo.Shapes_TabID_Lbl]
GO
ALTER TABLE [dbo].[LinesUnbouded]  WITH CHECK ADD  CONSTRAINT [FK_dbo.LinesUnbouded_dbo.Lines_TabID_Lbl] FOREIGN KEY([TabID], [Lbl])
REFERENCES [dbo].[Lines] ([TabID], [Lbl])
GO
ALTER TABLE [dbo].[LinesUnbouded] CHECK CONSTRAINT [FK_dbo.LinesUnbouded_dbo.Lines_TabID_Lbl]
GO
ALTER TABLE [dbo].[LinesUnbouded]  WITH CHECK ADD  CONSTRAINT [FK_dbo.LinesUnbouded_dbo.Points_p2_TabID_p2_Lbl] FOREIGN KEY([p2_TabID], [p2_Lbl])
REFERENCES [dbo].[Points] ([TabID], [Lbl])
GO
ALTER TABLE [dbo].[LinesUnbouded] CHECK CONSTRAINT [FK_dbo.LinesUnbouded_dbo.Points_p2_TabID_p2_Lbl]
GO
ALTER TABLE [dbo].[Points]  WITH CHECK ADD  CONSTRAINT [FK_dbo.Points_dbo.Shapes_TabID_Lbl] FOREIGN KEY([TabID], [Lbl])
REFERENCES [dbo].[Shapes] ([TabID], [Lbl])
GO
ALTER TABLE [dbo].[Points] CHECK CONSTRAINT [FK_dbo.Points_dbo.Shapes_TabID_Lbl]
GO
ALTER TABLE [dbo].[RoomModerators]  WITH CHECK ADD  CONSTRAINT [FK_dbo.RoomModerators_dbo.Moderators_Moderator_Username] FOREIGN KEY([Moderator_Username])
REFERENCES [dbo].[Moderators] ([Username])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[RoomModerators] CHECK CONSTRAINT [FK_dbo.RoomModerators_dbo.Moderators_Moderator_Username]
GO
ALTER TABLE [dbo].[RoomModerators]  WITH CHECK ADD  CONSTRAINT [FK_dbo.RoomModerators_dbo.Rooms_Room_ID] FOREIGN KEY([Room_ID])
REFERENCES [dbo].[Rooms] ([ID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[RoomModerators] CHECK CONSTRAINT [FK_dbo.RoomModerators_dbo.Rooms_Room_ID]
GO
ALTER TABLE [dbo].[Rooms]  WITH CHECK ADD  CONSTRAINT [FK_dbo.Rooms_dbo.Moderators_Moderator_Username] FOREIGN KEY([Moderator_Username])
REFERENCES [dbo].[Moderators] ([Username])
GO
ALTER TABLE [dbo].[Rooms] CHECK CONSTRAINT [FK_dbo.Rooms_dbo.Moderators_Moderator_Username]
GO
ALTER TABLE [dbo].[Shapes]  WITH CHECK ADD  CONSTRAINT [FK_dbo.Shapes_dbo.Tabs_TabID] FOREIGN KEY([TabID])
REFERENCES [dbo].[Tabs] ([ID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Shapes] CHECK CONSTRAINT [FK_dbo.Shapes_dbo.Tabs_TabID]
GO
ALTER TABLE [dbo].[Tabs]  WITH CHECK ADD  CONSTRAINT [FK_dbo.Tabs_dbo.Groups_GroupID] FOREIGN KEY([GroupID])
REFERENCES [dbo].[Groups] ([RoomID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Tabs] CHECK CONSTRAINT [FK_dbo.Tabs_dbo.Groups_GroupID]
GO
ALTER TABLE [dbo].[VActions]  WITH CHECK ADD  CONSTRAINT [FK_dbo.VActions_dbo.Shapes_TabID_ShapeLbl] FOREIGN KEY([TabID], [ShapeLbl])
REFERENCES [dbo].[Shapes] ([TabID], [Lbl])
GO
ALTER TABLE [dbo].[VActions] CHECK CONSTRAINT [FK_dbo.VActions_dbo.Shapes_TabID_ShapeLbl]
GO
ALTER TABLE [dbo].[VActions]  WITH CHECK ADD  CONSTRAINT [FK_dbo.VActions_dbo.Tabs_TabID] FOREIGN KEY([TabID])
REFERENCES [dbo].[Tabs] ([ID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[VActions] CHECK CONSTRAINT [FK_dbo.VActions_dbo.Tabs_TabID]
GO
ALTER TABLE [dbo].[VActions]  WITH CHECK ADD  CONSTRAINT [FK_dbo.VActions_dbo.Users_UserID] FOREIGN KEY([UserID])
REFERENCES [dbo].[Users] ([Username])
GO
ALTER TABLE [dbo].[VActions] CHECK CONSTRAINT [FK_dbo.VActions_dbo.Users_UserID]
GO
ALTER TABLE [dbo].[VMsgs]  WITH CHECK ADD  CONSTRAINT [FK_dbo.VMsgs_dbo.Groups_GroupID] FOREIGN KEY([GroupID])
REFERENCES [dbo].[Groups] ([RoomID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[VMsgs] CHECK CONSTRAINT [FK_dbo.VMsgs_dbo.Groups_GroupID]
GO
ALTER TABLE [dbo].[VMsgs]  WITH CHECK ADD  CONSTRAINT [FK_dbo.VMsgs_dbo.Users_UserID] FOREIGN KEY([UserID])
REFERENCES [dbo].[Users] ([Username])
GO
ALTER TABLE [dbo].[VMsgs] CHECK CONSTRAINT [FK_dbo.VMsgs_dbo.Users_UserID]
GO
USE [master]
GO
ALTER DATABASE [ServerSagletModel] SET  READ_WRITE 
GO
