-- Remove legacy "finals" phase row (not a real event phase — only phase_1 and phase_2 exist)

delete from phases where name = 'finals';
