-- 1. Enable RLS on all tables (คำสั่งนี้รันซ้ำได้ ไม่มีปัญหา)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_schedules ENABLE ROW LEVEL SECURITY;

-- 2. Profiles policies
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = id) WITH CHECK ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;
CREATE POLICY "Users can delete their own profile" ON public.profiles FOR DELETE TO authenticated USING ((SELECT auth.uid()) = id);

-- 3. Subjects policies
DROP POLICY IF EXISTS "Anyone can view subjects" ON public.subjects;
CREATE POLICY "Anyone can view subjects" ON public.subjects FOR SELECT TO authenticated USING (true);

-- 4. User skills policies
DROP POLICY IF EXISTS "Users can view all skills" ON public.user_skills;
CREATE POLICY "Users can view all skills" ON public.user_skills FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Users can insert their own skills" ON public.user_skills;
CREATE POLICY "Users can insert their own skills" ON public.user_skills FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own skills" ON public.user_skills;
CREATE POLICY "Users can update their own skills" ON public.user_skills FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own skills" ON public.user_skills;
CREATE POLICY "Users can delete their own skills" ON public.user_skills FOR DELETE TO authenticated USING ((SELECT auth.uid()) = user_id);

-- 5. Study groups policies
DROP POLICY IF EXISTS "Anyone can view public groups" ON public.study_groups;
CREATE POLICY "Anyone can view public groups" ON public.study_groups FOR SELECT TO authenticated USING (
    group_type = 'public' 
    OR created_by = (SELECT auth.uid()) 
    OR EXISTS (SELECT 1 FROM public.group_members WHERE group_id = id AND user_id = (SELECT auth.uid()))
);

DROP POLICY IF EXISTS "Authenticated users can create groups" ON public.study_groups;
CREATE POLICY "Authenticated users can create groups" ON public.study_groups FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = created_by);

DROP POLICY IF EXISTS "Group owners can update their groups" ON public.study_groups;
CREATE POLICY "Group owners can update their groups" ON public.study_groups FOR UPDATE TO authenticated USING (created_by = (SELECT auth.uid())) WITH CHECK (created_by = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Group owners can delete their groups" ON public.study_groups;
CREATE POLICY "Group owners can delete their groups" ON public.study_groups FOR DELETE TO authenticated USING (created_by = (SELECT auth.uid()));

-- 6. Group members policies
DROP POLICY IF EXISTS "Users can view members of their groups" ON public.group_members;
CREATE POLICY "Users can view members of their groups" ON public.group_members FOR SELECT TO authenticated USING (
    EXISTS (
        SELECT 1 FROM public.study_groups 
        WHERE id = group_id 
        AND (
            group_type = 'public' 
            OR created_by = (SELECT auth.uid()) 
            OR EXISTS (SELECT 1 FROM public.group_members gm WHERE gm.group_id = id AND gm.user_id = (SELECT auth.uid()))
        )
    )
);

DROP POLICY IF EXISTS "Users can join groups" ON public.group_members;
CREATE POLICY "Users can join groups" ON public.group_members FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Group owners and members can update membership" ON public.group_members;
CREATE POLICY "Group owners and members can update membership" ON public.group_members FOR UPDATE TO authenticated USING (
    (SELECT auth.uid()) = user_id 
    OR EXISTS (SELECT 1 FROM public.study_groups WHERE id = group_id AND created_by = (SELECT auth.uid()))
);

DROP POLICY IF EXISTS "Users can leave groups" ON public.group_members;
CREATE POLICY "Users can leave groups" ON public.group_members FOR DELETE TO authenticated USING (
    (SELECT auth.uid()) = user_id 
    OR EXISTS (SELECT 1 FROM public.study_groups WHERE id = group_id AND created_by = (SELECT auth.uid()))
);

-- 7. Documents policies
DROP POLICY IF EXISTS "Users can view public documents" ON public.documents;
CREATE POLICY "Users can view public documents" ON public.documents FOR SELECT TO authenticated USING (
    is_public = true 
    OR uploaded_by = (SELECT auth.uid()) 
    OR (group_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.group_members WHERE group_id = public.documents.group_id AND user_id = (SELECT auth.uid())))
);

DROP POLICY IF EXISTS "Authenticated users can upload documents" ON public.documents;
CREATE POLICY "Authenticated users can upload documents" ON public.documents FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = uploaded_by);

DROP POLICY IF EXISTS "Document owners can update their documents" ON public.documents;
CREATE POLICY "Document owners can update their documents" ON public.documents FOR UPDATE TO authenticated USING (uploaded_by = (SELECT auth.uid())) WITH CHECK (uploaded_by = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Document owners can delete their documents" ON public.documents;
CREATE POLICY "Document owners can delete their documents" ON public.documents FOR DELETE TO authenticated USING (uploaded_by = (SELECT auth.uid()));

-- 8. Study sessions policies
DROP POLICY IF EXISTS "Group members can view study sessions" ON public.study_sessions;
CREATE POLICY "Group members can view study sessions" ON public.study_sessions FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.group_members WHERE group_id = public.study_sessions.group_id AND user_id = (SELECT auth.uid()))
);

DROP POLICY IF EXISTS "Group members can create study sessions" ON public.study_sessions;
CREATE POLICY "Group members can create study sessions" ON public.study_sessions FOR INSERT TO authenticated WITH CHECK (
    (SELECT auth.uid()) = created_by 
    AND EXISTS (SELECT 1 FROM public.group_members WHERE group_id = public.study_sessions.group_id AND user_id = (SELECT auth.uid()))
);

DROP POLICY IF EXISTS "Session creators can update their sessions" ON public.study_sessions;
CREATE POLICY "Session creators can update their sessions" ON public.study_sessions FOR UPDATE TO authenticated USING (created_by = (SELECT auth.uid())) WITH CHECK (created_by = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Session creators can delete their sessions" ON public.study_sessions;
CREATE POLICY "Session creators can delete their sessions" ON public.study_sessions FOR DELETE TO authenticated USING (created_by = (SELECT auth.uid()));

-- 9. Exam schedules policies
DROP POLICY IF EXISTS "Users can
