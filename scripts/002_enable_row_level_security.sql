-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_schedules ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can delete their own profile" ON public.profiles
  FOR DELETE USING (auth.uid() = id);

-- Subjects policies (read-only for all authenticated users)
CREATE POLICY "Anyone can view subjects" ON public.subjects
  FOR SELECT USING (true);

-- User skills policies
CREATE POLICY "Users can view all skills" ON public.user_skills
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own skills" ON public.user_skills
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own skills" ON public.user_skills
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own skills" ON public.user_skills
  FOR DELETE USING (auth.uid() = user_id);

-- Study groups policies
CREATE POLICY "Anyone can view public groups" ON public.study_groups
  FOR SELECT USING (
    group_type = 'public' OR 
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.group_members 
      WHERE group_id = id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can create groups" ON public.study_groups
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Group owners can update their groups" ON public.study_groups
  FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Group owners can delete their groups" ON public.study_groups
  FOR DELETE USING (created_by = auth.uid());

-- Group members policies
CREATE POLICY "Users can view members of their groups" ON public.group_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.study_groups 
      WHERE id = group_id AND (
        group_type = 'public' OR 
        created_by = auth.uid() OR
        EXISTS (SELECT 1 FROM public.group_members gm WHERE gm.group_id = id AND gm.user_id = auth.uid())
      )
    )
  );

CREATE POLICY "Users can join groups" ON public.group_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Group owners and members can update membership" ON public.group_members
  FOR UPDATE USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.study_groups 
      WHERE id = group_id AND created_by = auth.uid()
    )
  );

CREATE POLICY "Users can leave groups" ON public.group_members
  FOR DELETE USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.study_groups 
      WHERE id = group_id AND created_by = auth.uid()
    )
  );

-- Documents policies
CREATE POLICY "Users can view public documents" ON public.documents
  FOR SELECT USING (
    is_public = true OR
    uploaded_by = auth.uid() OR
    (group_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.group_members 
      WHERE group_id = documents.group_id AND user_id = auth.uid()
    ))
  );

CREATE POLICY "Authenticated users can upload documents" ON public.documents
  FOR INSERT WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Document owners can update their documents" ON public.documents
  FOR UPDATE USING (uploaded_by = auth.uid());

CREATE POLICY "Document owners can delete their documents" ON public.documents
  FOR DELETE USING (uploaded_by = auth.uid());

-- Study sessions policies
CREATE POLICY "Group members can view study sessions" ON public.study_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.group_members 
      WHERE group_id = study_sessions.group_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Group members can create study sessions" ON public.study_sessions
  FOR INSERT WITH CHECK (
    auth.uid() = created_by AND
    EXISTS (
      SELECT 1 FROM public.group_members 
      WHERE group_id = study_sessions.group_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Session creators can update their sessions" ON public.study_sessions
  FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Session creators can delete their sessions" ON public.study_sessions
  FOR DELETE USING (created_by = auth.uid());

-- Exam schedules policies
CREATE POLICY "Users can view their own exam schedules" ON public.exam_schedules
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own exam schedules" ON public.exam_schedules
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own exam schedules" ON public.exam_schedules
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own exam schedules" ON public.exam_schedules
  FOR DELETE USING (auth.uid() = user_id);
