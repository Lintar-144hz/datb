'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import { GlassInput } from '@/components/ui/GlassInput';
import { GlassButton } from '@/components/ui/GlassButton';
import { useGoals } from '@/hooks/useGoals';
import { useFinanceStore } from '@/store/useFinanceStore';
import { Target, Calendar, DollarSign, Flag } from 'lucide-react';

const schema = z.object({
  title: z.string().min(2, 'Judul minimal 2 karakter'),
  target: z.number().min(1000, 'Target minimal Rp 1.000'),
  current: z.number().min(0, 'Jumlah terkumpul tidak boleh negatif').optional(),
  deadline: z.string().optional().nullable(),
});

type FormData = z.infer<typeof schema>;

export function GoalFormModal() {
  const { isAddGoalOpen, activeEditGoalId, closeAddGoalModal } = useFinanceStore();
  const { goals, addGoal, updateGoal, isAdding, isUpdating } = useGoals();

  const editGoal = activeEditGoalId ? goals.find((g) => g.id === activeEditGoalId) : null;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      target: 0,
      current: 0,
      deadline: '',
    },
  });

  useEffect(() => {
    if (editGoal) {
      setValue('title', editGoal.title);
      setValue('target', editGoal.target);
      setValue('current', editGoal.current);
      setValue('deadline', editGoal.deadline || '');
    } else {
      reset({
        title: '',
        target: 0,
        current: 0,
        deadline: '',
      });
    }
  }, [editGoal, setValue, reset, isAddGoalOpen]);

  const onSubmit = async (data: FormData) => {
    try {
      if (editGoal) {
        await updateGoal({
          id: editGoal.id,
          data: {
            title: data.title,
            target: data.target,
            current: data.current || 0,
            deadline: data.deadline || null,
          },
        });
      } else {
        await addGoal({
          title: data.title,
          target: data.target,
          current: data.current || 0,
          deadline: data.deadline || null,
        });
      }
      closeAddGoalModal();
      reset();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal
      isOpen={isAddGoalOpen}
      onClose={closeAddGoalModal}
      title={editGoal ? 'Edit Target Tabungan' : 'Buat Target Tabungan Baru'}
      description="Rencanakan impian & keuangan jangka panjang"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
        {/* Title */}
        <GlassInput
          label="Nama Target Impian"
          placeholder="Contoh: Beli Laptop Baru, Liburan ke Bali, DP Rumah"
          icon={<Flag className="h-4 w-4" />}
          error={errors.title?.message}
          {...register('title')}
        />

        {/* Target Amount */}
        <GlassInput
          label="Target Nominal (Rp)"
          type="number"
          placeholder="10000000"
          icon={<DollarSign className="h-4 w-4" />}
          error={errors.target?.message}
          {...register('target', { valueAsNumber: true })}
        />

        {/* Current Amount */}
        <GlassInput
          label="Saldo Awal Terkumpul (Rp)"
          type="number"
          placeholder="0"
          icon={<Target className="h-4 w-4" />}
          error={errors.current?.message}
          {...register('current', { valueAsNumber: true })}
        />

        {/* Deadline */}
        <GlassInput
          label="Target Tanggal Selesai (Opsional)"
          type="date"
          icon={<Calendar className="h-4 w-4" />}
          {...register('deadline')}
        />

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200/50 dark:border-slate-800">
          <GlassButton type="button" variant="ghost" onClick={closeAddGoalModal}>
            Batal
          </GlassButton>
          <GlassButton type="submit" variant="primary" isLoading={isAdding || isUpdating}>
            {editGoal ? 'Simpan Target' : 'Buat Target Baru'}
          </GlassButton>
        </div>
      </form>
    </Modal>
  );
}
